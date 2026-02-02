import { z } from "zod";
import { isValidRut, normalizeRut } from "./rut";

const rutMessage = "RUT invÃ¡lido. Usa el formato 12345678-9.";

const rutTransform = z
  .string()
  .min(8, { message: rutMessage })
  .max(12, { message: rutMessage })
  .transform((value) => formatRutValue(value))
  .refine((value) => isValidRut(value), { message: rutMessage });

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(8, { message: "Ingresa tu nombre completo con al menos 8 caracteres." })
      .max(60, { message: "MÃ¡ximo 60 caracteres." })
      .regex(/^[A-Za-zÃÃ‰ÃÃ“ÃšÃ¡Ã©Ã­Ã³ÃºÃ‘Ã±\s]+$/, { message: "Solo letras y espacios." }),
    rut: rutTransform,
    username: z
      .string()
      .regex(/^[A-Za-z0-9_.-]{4,16}$/, {
        message: "Usa 4-16 caracteres con letras, nÃºmeros y ._-",
      }),
    email: z
      .string()
      .email({ message: "Correo invÃ¡lido." })
      .max(80, { message: "MÃ¡ximo 80 caracteres." }),
    password: z
      .string()
      .min(8, { message: "Usa al menos 8 caracteres." })
      .max(64, { message: "MÃ¡ximo 64 caracteres." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
        message: "Debe incluir al menos una letra y un nÃºmero.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Debe coincidir con la contraseÃ±a." }),
    bikeNumber: z
      .string()
      .regex(/^\d{4}$/, { message: "El nÃºmero debe tener 4 dÃ­gitos." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseÃ±as no coinciden.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(4, { message: "Ingresa tu correo o RUT." })
    .transform((value) => value.trim()),
  password: z.string().min(8, { message: "Ingresa tu contraseña completa." }),
});

export const slotMutationSchema = z.object({
  slotId: z.number().int().positive(),
  action: z.enum(["reserve", "release"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

function formatRutValue(value: string) {
  const cleaned = normalizeRut(value);
  if (cleaned.length < 2) {
    return cleaned;
  }
  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}
