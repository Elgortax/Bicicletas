"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";

type Slot = {
  id: number;
  label: string;
  occupied: boolean;
  occupantId?: string | null;
  occupant?: {
    id: string;
    fullName: string;
    bikeNumber: string;
  } | null;
};

type Props = {
  initialSlots: Slot[];
  userId: string;
  isAdmin: boolean;
};

export function SlotGrid({ initialSlots, userId, isAdmin }: Props) {
  const [slots, setSlots] = useState(initialSlots);
  const [message, setMessage] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const handleClick = (slot: Slot) => {
    const isMine = slot.occupant?.id === userId;
    const action = slot.occupied && isMine ? "release" : "reserve";
    startTransition(async () => {
      setMessage(undefined);
      const response = await fetch("/api/slots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId: slot.id, action }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setMessage(payload.message ?? "No se pudo actualizar el espacio.");
        return;
      }
      setSlots(payload.slots);
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => {
          const isMine = slot.occupant?.id === userId;
          const isOccupied = slot.occupied;
          const isDisabled = isPending || (isOccupied && !isMine && !isAdmin);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => handleClick(slot)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isMine
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                  : isOccupied
                    ? "border-slate-300 bg-slate-100 text-slate-500"
                    : "border-amber-400 bg-white text-slate-900 hover:-translate-y-0.5"
              } ${isDisabled ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={isDisabled}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Espacio</p>
              <p className="text-2xl font-semibold">{slot.label}</p>
              <p className="text-xs text-slate-500">
                {isMine && "Tu bicicleta"}
                {!isMine && isOccupied && slot.occupant ? `Ocupado por ${slot.occupant.fullName}` : null}
                {!isOccupied && "Disponible"}
              </p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
          <span className="size-2 rounded-full bg-emerald-500" />
          Tu reserva
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-slate-700">
          <span className="size-2 rounded-full bg-amber-400" />
          Disponible
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
          <span className="size-2 rounded-full bg-slate-400" />
          Ocupado
        </span>
      </div>
      <FormError message={message} />
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={() =>
          startTransition(async () => {
            const response = await fetch("/api/slots");
            const payload = await response.json();
            if (response.ok) {
              setSlots(payload.slots);
              setMessage(undefined);
            } else {
              setMessage(payload.message ?? "No pudimos sincronizar los espacios.");
            }
          })
        }
        isLoading={isPending}
      >
        Actualizar estado
      </Button>
    </div>
  );
}
