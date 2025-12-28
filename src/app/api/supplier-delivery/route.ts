import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toListItem } from "@/modules/supplier-delivery/mappers";
import {
  createSupplierDelivery,
  findManySupplierDelivery,
} from "@/modules/supplier-delivery/repository";
import { GetQuerySchema } from "@/modules/supplier-delivery/search-params";
import { SupplierDeliveryCreateSchema } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validate = validateRequest({
      querySchema: GetQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { query } = data;

    const where = {
      userId: session?.user.id,
      status: query.status,
    };

    const result = await findManySupplierDelivery(where);

    return NextResponse.json(result.map((i) => toListItem(i)));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validate = validateRequest({
      bodySchema: SupplierDeliveryCreateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await createSupplierDelivery(session?.user.id, body);

    return NextResponse.json(toListItem(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
