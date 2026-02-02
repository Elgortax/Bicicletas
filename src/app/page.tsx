import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const features = [
  {
    title: "Formulario conocido",
    description: "Nombre, RUT, usuario y correo en un formato simple. El sistema avisa al instante si falta algo.",
    icon: "📝",
  },
  {
    title: "Estado visual",
    description: "Los espacios libres aparecen en amarillo, tu reserva en verde y los demás en gris.",
    icon: "🚲",
  },
  {
    title: "Tus datos",
    description: "Se guardan en una base privada y solo se muestran dentro de tu sesión y el tablero general.",
    icon: "🔐",
  },
];

const steps = [
  { title: "1. Regístrate", detail: "Completa tus datos y obtén un número de bicicleta de cuatro dígitos." },
  { title: "2. Inicia sesión", detail: "Puedes usar tu correo o el RUT sin puntos y con guion." },
  { title: "3. Reserva", detail: "Elige un cupo libre y úsalo durante toda tu jornada de estudio." },
];

const tips = [
  "Solo letras y espacios para el nombre (8 a 60 caracteres).",
  "RUT sin puntos y con guion final, por ejemplo 12345678-9.",
  "La contraseña debe tener al menos 8 caracteres, una letra y un número.",
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600 shadow-md shadow-amber-100">
            Proyecto académico
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Registra tu bicicleta y elige un espacio disponible.
          </h1>
          <p className="text-lg text-slate-600">
            Esta versión digitaliza el formulario clásico de Bicicletas Duoc. Pensada para practicar, con pasos claros y
            sin depender de herramientas externas.
          </p>
          {user ? (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-600"
              >
                Ir a mi panel
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-600"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Ya tengo acceso
              </Link>
            </div>
          )}
          {!user && (
            <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600">
              {tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200">
          <div className="rounded-2xl bg-slate-900 p-3 text-xs text-white">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mt-4 space-y-3 rounded-xl bg-white/10 p-4 text-sm">
              <p className="font-semibold text-amber-200">Vista del tablero</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={`slot-${index}`}
                    className={`rounded-md px-3 py-3 font-semibold ${
                      index === 2
                        ? "bg-emerald-400 text-emerald-950"
                        : index % 3 === 0
                          ? "bg-amber-400 text-amber-950"
                          : "bg-white/20 text-white"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">Referencia visual del dashboard que verás al ingresar.</p>
        </div>
      </section>

      <section id="features" className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pasos" className="bg-slate-900">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-16 text-white md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/20 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">{step.title}</p>
              <p className="mt-3 text-sm text-slate-100">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
