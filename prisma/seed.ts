import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const libsqlUrl = process.env.TURSO_DATABASE_URL;
const libsqlToken = process.env.TURSO_AUTH_TOKEN;
console.log("Seeding using", libsqlUrl);

const adapter = libsqlUrl
  ? new PrismaLibSql({
      url: libsqlUrl,
      authToken: libsqlToken,
    })
  : undefined;

const prisma = new PrismaClient(adapter ? { adapter } : undefined);

async function main() {
  const labels = buildLabels();
  await Promise.all(
    labels.map((label) =>
      prisma.bikeSlot.upsert({
        where: { label },
        update: {},
        create: { label },
      }),
    ),
  );

  const users = await prisma.user.count();
  if (users === 0) {
    await prisma.user.create({
      data: {
        fullName: "Administrador Bicicletas",
        rut: "11111111-1",
        username: "admin",
        email: "admin@duoc.cl",
        passwordHash: await bcrypt.hash("Cambiar123!", 12),
        bikeNumber: "1000",
        role: "ADMIN",
      },
    });
    console.info("Usuario administrador creado: admin@duoc.cl / Cambiar123!");
  }
}

function buildLabels() {
  const prefixes = ["A", "B", "C"];
  const labels: string[] = [];
  prefixes.forEach((prefix) => {
    for (let i = 1; i <= 8; i += 1) {
      labels.push(`${prefix}${i}`);
    }
  });
  return labels;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
