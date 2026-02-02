# Bicicletas Duoc

Aplicación sencilla para registrar usuarios y asignar espacios de bicicletas dentro del campus. El proyecto se reescribió con Next.js 16, Prisma y TailwindCSS, dejando atrás la versión en PHP.

## Características principales
- Formularios con validaciones en vivo para nombre, RUT, usuario, correo y contraseña.
- Panel que muestra los espacios disponibles y permite reservar/liberar solo al dueño o al administrador.
- Prisma ORM usa SQLite local (`LOCAL_DATABASE_URL`) para comandos de Prisma y LibSQL/Turso en tiempo de ejecución cuando defines `TURSO_*`.
- Scripts `db:push` y `db:seed` para preparar la base con un usuario administrador de ejemplo.

## Requisitos
- Node.js 20+
- npm 10+

## Puesta en marcha
1. Instala dependencias  
   `npm install`
2. Copia el archivo de entorno  
   `cp .env.example .env` (o `Copy-Item .env.example .env` en PowerShell) y define `LOCAL_DATABASE_URL` (si quieres cambiar la ruta), `JWT_SECRET` y, cuando estés listo para Turso, `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
3. Crea el archivo de base de datos local (Windows `type NUL > prisma\dev.db`, macOS/Linux `touch prisma/dev.db`). Este archivo solo se usa para que `prisma db push` y `prisma migrate diff` tengan un destino local.
4. Aplica el esquema y genera el cliente local  
   `npm run db:push`
5. Pobla datos de prueba (contra la base local o Turso si tienes las variables configuradas)  
   `npm run db:seed`.
6. Levanta el entorno de desarrollo  
   `npm run dev` y visita http://localhost:3000.

Comandos adicionales:

| Script | Descripción |
| --- | --- |
| `npm run lint` | Ejecuta ESLint |
| `npm run build` | Build de producción |
| `npm run db:studio` | Abre Prisma Studio |

## Despliegue (ejemplo con Vercel)
1. Crea una base gestionada. Puedes usar Turso (libSQL) o Postgres (Neon/Supabase).  
   - **Turso**: en `.env` (y luego en Vercel) mantén `LOCAL_DATABASE_URL="file:./prisma/dev.db"` para los comandos de Prisma y agrega  
     ```
     TURSO_DATABASE_URL="libsql://tu-db.turso.io"
     TURSO_AUTH_TOKEN="..."
     ```  
     Aplica el esquema remoto con el CLI/panel de Turso, por ejemplo `turso db shell bicicletas-duoc --file prisma/migrations/init.sql`.  
   - **Postgres**: cambia `provider` en `prisma/schema.prisma` a `"postgresql"` y actualiza `LOCAL_DATABASE_URL` con la cadena real (ya no usarás Turso).
2. Después de actualizar las variables, ejecuta `npm run db:seed` (con `TURSO_*` apuntando a la nube) para crear al admin en la base remota.
3. Sube el proyecto a GitHub/GitLab y vincúlalo en Vercel. Define `LOCAL_DATABASE_URL`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (si aplica) y `JWT_SECRET`.
4. Vercel ejecutará `npm run build`. Comprueba `/register`, `/login` y `/dashboard`.

## Migración de datos antiguos
Si necesitas recuperar información del formulario previo, exporta la tabla a CSV y usa un script basado en `prisma/seed.ts` para importar los registros (normaliza el RUT y vuelve a hashear las contraseñas).

---
Proyecto académico, libre para que lo adaptes y lo muestres en tu portafolio.
