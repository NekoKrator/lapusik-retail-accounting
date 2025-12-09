import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { SupplierCreateInput } from "@/schemas/supplier-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  const { error, session } = await requireAuth();
  if (error) {
    return error;
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const includeDeliveries = searchParams
      .get("include")
      ?.includes("deliveries");

    if (includeDeliveries && session.user.role === "admin") {
      const suppliersWithDeliveries = await prisma.supplier.findMany({
        include: {
          deliveries: {
            select: {
              paidByCashier: true,
              paidByOwner: true,
              price: true,
            },
          },
        },
      });
      return NextResponse.json(suppliersWithDeliveries);
    }

    const suppliers = await prisma.supplier.findMany();
    return NextResponse.json(suppliers);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAuth(["admin"]);
  if (error) {
    return error;
  }

  try {
    const body = await req.json();
    const parsed = SupplierCreateInput.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: z.flattenError(parsed.error) },
        { status: 400 }
      );
    }

    const createdSupplier = await prisma.supplier.create({
      data: parsed.data,
      include: { deliveries: true },
    });

    return NextResponse.json(createdSupplier, { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
