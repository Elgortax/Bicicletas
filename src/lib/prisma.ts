// @ts-ignore PrismaClient está disponible en la build edge aunque no tenga typings.
import { PrismaClient } from "@prisma/client/edge";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const libsqlUrl = process.env.TURSO_DATABASE_URL;
const libsqlToken = process.env.TURSO_AUTH_TOKEN;

const adapter = libsqlUrl
  ? new PrismaLibSql({
      url: libsqlUrl,
      authToken: libsqlToken,
    })
  : undefined;

const globalForPrisma = globalThis as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(adapter ? { adapter } : {}),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
