require("dotenv/config");

const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  const count = await prisma.user.count();
  console.log("Usuarios en dev.db:", count);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
