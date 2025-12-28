import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toListItem } from "@/modules/supplier/mappers";
import {
  createSupplier,
  findManySupplier,
} from "@/modules/supplier/repository";
import { SupplierCreateSchema } from "@/schemas/supplier/supplier-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(_req: NextRequest) {
  try {
    const result = await findManySupplier();

    return NextResponse.json(result.map((item) => toListItem(item)));
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

    const result = await createSupplier(body);

    return NextResponse.json(toListItem(result), { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
