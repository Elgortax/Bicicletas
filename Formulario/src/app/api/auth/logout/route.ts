import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada." });
  removeSessionCookie(response);
  return response;
}
