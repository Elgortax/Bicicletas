import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { slotMutationSchema } from "@/lib/validators";

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  const slots = await fetchSlots();
  return NextResponse.json({ slots });
}

export async function PATCH(request: Request) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = slotMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
    }

    const { slotId, action } = parsed.data;
    const targetSlot = await prisma.bikeSlot.findUnique({
      where: { id: slotId },
      include: { occupant: { select: { id: true } } },
    });
    if (!targetSlot) {
      return NextResponse.json({ message: "Espacio no encontrado." }, { status: 404 });
    }

    if (action === "reserve") {
      if (targetSlot.occupied && targetSlot.occupantId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ message: "Ese espacio ya está ocupado." }, { status: 409 });
      }
      await reserveSlot(slotId, user.id, user.assignedSlot?.id);
    } else {
      if (!targetSlot.occupied) {
        return NextResponse.json({ message: "El espacio ya está libre." }, { status: 400 });
      }
      if (targetSlot.occupantId !== user.id && user.role !== "ADMIN") {
        return NextResponse.json({ message: "Solo el propietario o un admin puede liberar este espacio." }, { status: 403 });
      }
      await prisma.bikeSlot.update({
        where: { id: slotId },
        data: {
          occupied: false,
          occupant: { disconnect: true },
        },
      });
    }

    const slots = await fetchSlots();
    return NextResponse.json({ slots });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "No pudimos actualizar el espacio." }, { status: 500 });
  }
}

async function reserveSlot(slotId: number, userId: string, currentSlotId?: number | null) {
  const actions = [];
  if (currentSlotId) {
    actions.push(
      prisma.bikeSlot.update({
        where: { id: currentSlotId },
        data: {
          occupied: false,
          occupant: { disconnect: true },
        },
      }),
    );
  }
  actions.push(
    prisma.bikeSlot.update({
      where: { id: slotId },
      data: {
        occupied: true,
        occupant: { connect: { id: userId } },
      },
    }),
  );
  await prisma.$transaction(actions);
}

async function fetchSlots() {
  const slots = await prisma.bikeSlot.findMany({
    orderBy: { label: "asc" },
    include: { occupant: { select: { id: true, fullName: true, bikeNumber: true } } },
  });
  return slots.map((slot) => ({
    id: slot.id,
    label: slot.label,
    occupied: slot.occupied,
    occupantId: slot.occupantId,
    occupant: slot.occupant
      ? { id: slot.occupant.id, fullName: slot.occupant.fullName, bikeNumber: slot.occupant.bikeNumber }
      : null,
  }));
}
