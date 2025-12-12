import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierUpdateSchema } from "@/schemas/supplier-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: SupplierUpdateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const updatedSupplier = await prisma.supplier.update({
      where: { id },
      data: body,
      include: { deliveries: true },
    });

    return NextResponse.json(updatedSupplier);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const deletedSupplier = await prisma.supplier.delete({
      where: { id },
      include: { deliveries: true },
    });

    return NextResponse.json(deletedSupplier);
  } catch (err) {
    return handlePrismaError(err);
  }
}
