import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/validate-request";
import {
  toDeleteResult,
  toUpdateResult,
} from "@/modules/supplier-delivery/mappers";
import {
  deleteSupplierDelivery,
  updateSupplierDelivery,
} from "@/modules/supplier-delivery/repository";
import { SupplierDeliveryUpdateSchema } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const validate = validateRequest({
      bodySchema: SupplierDeliveryUpdateSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await updateSupplierDelivery(id, body);

    return NextResponse.json(toUpdateResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await deleteSupplierDelivery(id);

    return NextResponse.json(toDeleteResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
