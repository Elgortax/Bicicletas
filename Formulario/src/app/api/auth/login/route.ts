import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, addSessionCookie, verifyPassword } from "@/lib/auth";
import { normalizeRut } from "@/lib/rut";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Credenciales inválidas." },
        { status: 400 },
      );
    }

    const { identifier, password } = parsed.data;
    const user = await prisma.user.findFirst({
      where: identifier.includes("@")
        ? { email: identifier.toLowerCase() }
        : { rut: formatRut(identifier) },
    });

    if (!user) {
      return NextResponse.json({ message: "No encontramos una cuenta con esos datos." }, { status: 404 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Contraseña incorrecta." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ message: "Inicio de sesión exitoso." });
    addSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error en el servidor al iniciar sesión." }, { status: 500 });
  }
}

function formatRut(value: string) {
  const normalized = normalizeRut(value);
  if (normalized.length < 2) return normalized;
  return `${normalized.slice(0, -1)}-${normalized.slice(-1)}`;
}
