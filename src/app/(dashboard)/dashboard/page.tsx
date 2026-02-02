import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { SlotGrid } from "@/components/slot-grid";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?from=dashboard");
  }

  const slots = await prisma.bikeSlot.findMany({
    orderBy: { label: "asc" },
    include: { occupant: { select: { id: true, fullName: true, bikeNumber: true } } },
  });

  type SlotWithOccupant = (typeof slots)[number];

  const serializedSlots = slots.map((slot: SlotWithOccupant) => ({
    id: slot.id,
    label: slot.label,
    occupied: slot.occupied,
    occupantId: slot.occupantId,
    occupant: slot.occupant
      ? { id: slot.occupant.id, fullName: slot.occupant.fullName, bikeNumber: slot.occupant.bikeNumber }
      : null,
  }));

  const availableSlots = serializedSlots.filter((slot) => !slot.occupied).length;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Hola</p>
          <h1 className="text-3xl font-semibold text-slate-900">{user.fullName}</h1>
          <p className="text-sm text-slate-500">Bicicleta #{user.bikeNumber}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600">
            {availableSlots} espacios libres
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Mapa de estacionamientos</p>
              <h2 className="text-2xl font-semibold text-slate-900">Toca para reservar o liberar</h2>
            </div>
          </div>

          <div className="mt-6">
            <SlotGrid initialSlots={serializedSlots} userId={user.id} isAdmin={user.role === "ADMIN"} />
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Tus datos</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-slate-500">Usuario</dt>
              <dd className="font-semibold text-slate-900">@{user.username}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Correo</dt>
              <dd className="font-semibold text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">RUT</dt>
              <dd className="font-semibold text-slate-900">{user.rut}</dd>
            </div>
          </dl>
          <div className="mt-8 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Consejo</p>
            <p>Libera tu espacio al salir para que otro compañero pueda estacionar su bicicleta.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
