import { prisma } from "./prisma";

const MIN_NUMBER = 1000;
const MAX_NUMBER = 9999;

export async function getAvailableBikeNumber(preferred?: string) {
  if (preferred && (await isUnique(preferred))) {
    return preferred;
  }
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = randomNumber();
    if (await isUnique(candidate)) {
      return candidate;
    }
  }
  throw new Error("No hay números de bicicleta disponibles por el momento.");
}

async function isUnique(bikeNumber: string) {
  const existing = await prisma.user.findUnique({ where: { bikeNumber } });
  return !existing;
}

function randomNumber() {
  return String(Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER);
}
