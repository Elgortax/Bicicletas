import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { getAvailableBikeNumber } from "@/lib/bike-number";
import { createSessionToken, addSessionCookie, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Datos inválidos." },
        { status: 400 },
      );
    }

    const { confirmPassword: _confirmPassword, ...data } = parsed.data;
    void _confirmPassword;
    const username = data.username.toLowerCase();
    const conflicts: Array<Record<string, string>> = [{ email: data.email }, { rut: data.rut }, { username }];
    if (data.bikeNumber) {
      conflicts.push({ bikeNumber: data.bikeNumber });
    }
    const existing = await prisma.user.findFirst({
      where: {
        OR: conflicts,
      },
    });
    if (existing) {
      return NextResponse.json({ message: "Ya existe un usuario con esos datos." }, { status: 409 });
    }

    const bikeNumber = await getAvailableBikeNumber(data.bikeNumber);
    const passwordHash = await hashPassword(data.password);
    const totalUsers = await prisma.user.count();

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        rut: data.rut,
        username,
        email: data.email.toLowerCase(),
        passwordHash,
        bikeNumber,
        role: totalUsers === 0 ? "ADMIN" : "USER",
      },
    });

    const token = await createSessionToken(user);
    const response = NextResponse.json({ message: "Registro completado.", user: { fullName: user.fullName } });
    addSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error en el servidor al registrar." }, { status: 500 });
  }
}
