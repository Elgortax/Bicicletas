import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-500">Bienvenido</p>
        <h1 className="text-4xl font-semibold text-slate-900">Inicia sesión y verifica tu bicicleta.</h1>
        <p className="text-base text-slate-600">
          Accede al panel para ver el estado de los espacios, actualizar tu número de bicicleta o liberar un cupo para
          otra persona.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">¿Primera vez?</p>
          <p>
            Completa el formulario de <Link href="/register" className="text-amber-600 underline">registro</Link> para
            obtener tus credenciales y reservar tu estacionamiento.
          </p>
        </div>
      </div>
      <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-900">Ingresar</h2>
        <p className="text-sm text-slate-600">Usa el correo o RUT registrado.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
