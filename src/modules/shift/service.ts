import { prisma } from "@/lib/prisma";
import type { ShiftCloseInput } from "@/schemas/shift/shift-schema";
import { currentShiftSelect, lastClosedShiftSelect } from "./includes";

export function getCurrentShift(userId: string) {
  return prisma.$transaction(async (tx) => {
    const currentShift = await tx.shift.findFirst({
      where: { userId, isClosed: false },
      orderBy: { openedAt: "desc" },
      select: currentShiftSelect,
    });

    const lastClosedShift = await tx.shift.findFirst({
      where: { userId, isClosed: true },
      orderBy: { closedAt: "desc" },
      select: lastClosedShiftSelect,
    });

    return { currentShift, lastClosedShift };
  });
}

export function openShift(userId: string, openingBalance: number) {
  return prisma.$transaction(async (tx) => {
    const shift = await tx.shift.findFirst({
      where: { userId, isClosed: false },
    });

    if (shift) {
      throw new Error("SHIFT_ALREADY_EXIST");
    }

    const openedShift = await tx.shift.create({
      data: { openingBalance, user: { connect: { id: userId } } },
      select: currentShiftSelect,
    });

    return openedShift;
  });
}

export function closeShift(userId: string, data: ShiftCloseInput) {
  return prisma.$transaction(async (tx) => {
    const shift = await tx.shift.findFirst({
      where: { userId, isClosed: false },
    });

    if (!shift) {
      throw new Error("SHIFT_NOT_FOUND");
    }

    const openedShift = await tx.shift.update({
      where: { id: shift.id },
      data: {
        closedAt: new Date(),
        isClosed: true,
        ...data,
      },
    });

    return openedShift;
  });
}
