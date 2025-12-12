import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/validate-request";
import { SupplierCreateSchema } from "@/schemas/supplier-schema";
import { handlePrismaError } from "@/utils/error-handlers";

const GetQuerySchema = z.object({
  include: z.string().min(1).optional(),
  page: z.string().min(1).optional(),
  limit: z.string().min(1).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const includeDeliveries = query.include?.includes("deliveries");

    const include = {
      deliveries: includeDeliveries,
    };

    if (query.page && query.limit) {
      const page = Number(query.page);
      const limit = Number(query.limit);

      const result = await prisma.supplier.paginate({
        page,
        limit,
        include,
      });

      return NextResponse.json(result);
    }

    const suppliers = await prisma.supplier.findMany({
      include,
    });
    return NextResponse.json(suppliers);
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (session?.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validate = validateRequest({
      bodySchema: SupplierCreateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const createdSupplier = await prisma.supplier.create({
      data: body,
      include: { deliveries: true },
    });

    return NextResponse.json(createdSupplier, { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
