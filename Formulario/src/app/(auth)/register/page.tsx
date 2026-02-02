import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16">
      <div className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-500">Registro Bicicletas Duoc</p>
        <h1 className="text-4xl font-semibold text-slate-900">Tu cupo reservado en minutos.</h1>
        <p className="text-base text-slate-600">
          Completa este formulario para registrar tu bicicleta y recibir un número con el que identificarás tu espacio.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-900">Completa tus datos</h2>
        <p className="text-sm text-slate-600">Todos los campos son obligatorios.</p>
        <div className="mt-8">
          <RegisterForm />
        </div>
        <p className="mt-6 text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-amber-600">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </section>
  );
}
