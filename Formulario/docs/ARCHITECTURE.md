# Arquitectura

## Resumen
- Frontend y backend conviven en Next.js 16 (App Router) con TypeScript y TailwindCSS.
- Prisma ORM maneja la capa de datos. Los comandos de Prisma usan SQLite local (`LOCAL_DATABASE_URL`) y la app en ejecución se conecta vía LibSQL/Turso (o Postgres si lo configuras).
- El módulo de autenticación crea sesiones JWT almacenadas como cookies HttpOnly.
- Las rutas API (`app/api/*`) cubren registro, login/logout y la administración de espacios de bicicletas.

## Modelo de datos
```mermaid
erDiagram
  User ||--o| BikeSlot : "assignedSlot"
  User {
    string id PK
    string fullName
    string rut unique
    string username unique
    string email unique
    string passwordHash
    string bikeNumber unique
    string role (USER|ADMIN)
    datetime createdAt
    datetime updatedAt
  }
  BikeSlot {
    int id PK
    string label unique
    bool occupied
    string occupantId unique FK -> User.id
    datetime createdAt
    datetime updatedAt
  }
```

## Autenticación
1. **Registro (`POST /api/auth/register`)**
   - Zod valida nombre completo, RUT, usuario, correo y contraseña.
   - El RUT se normaliza y el número de bicicleta se genera si no llega uno válido.
   - La contraseña se almacena con `bcryptjs`.
   - Tras crear el registro se genera un JWT que se guarda en la cookie `session`.
2. **Login (`POST /api/auth/login`)**
   - Acepta correo o RUT más contraseña.
   - Si coincide, emite un nuevo JWT y actualiza la cookie.
3. **Protección**
   - `getCurrentUser()` lee la cookie y consulta Prisma.
   - Los handlers del dashboard y de `slots` revisan el usuario antes de responder.
   - Logout (`POST /api/auth/logout`) elimina la cookie.

## Reglas de espacios
- `GET /api/slots` devuelve todos los espacios con su estado.
- `PATCH /api/slots` acepta `{ slotId, action }` donde `action` es `reserve` o `release`.
  - Solo se puede reservar si el espacio está libre.
  - Solo el dueño del espacio (o un usuario con rol `ADMIN`) puede liberarlo.
  - Después de cada cambio se devuelve la lista completa para sincronizar la UI.

## Despliegue
1. Crea una base gestionada (libSQL/Turso o Postgres). Para Turso mantén `LOCAL_DATABASE_URL="file:./prisma/dev.db"` y aplica `prisma/migrations/init.sql` con el CLI/panel de Turso; para Postgres apunta `LOCAL_DATABASE_URL` directamente a la cadena remota.
2. Ejecuta `npm run db:push` solo contra la base local (SQLite) para generar `.db` y los clientes. Para entornos remotos aplica el SQL resultante de `prisma/migrate` o `prisma/migrations/*.sql`.
3. Configura `LOCAL_DATABASE_URL`, `TURSO_DATABASE_URL` (u otra cadena real) y `JWT_SECRET` en el proveedor donde publiques (por ejemplo, Vercel).
4. Corre `npm run build` para verificar que la app compila antes de subirla.

## Migración de datos antiguos
Si tienes registros previos, expórtalos a CSV y crea un script similar a `prisma/seed.ts` para importarlos:
1. Normaliza el RUT y conserva el formato `11111111-1`.
2. Re-hashea contraseñas con `bcrypt`.
3. Inserta usuarios y asigna espacios disponibles con Prisma.
