import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toWriteOffResult } from "@/modules/supplier-delivery/mappers";
import { WriteOffQuerySchema } from "@/modules/supplier-delivery/search-params";
import { writeOffSupplierDelivery } from "@/modules/supplier-delivery/service";
import { SupplierDeliveryWriteOffSchema } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const validate = validateRequest({
      bodySchema: SupplierDeliveryWriteOffSchema(),
      querySchema: WriteOffQuerySchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body, query } = data;

    const result = await writeOffSupplierDelivery({
      deliveryId: id,
      userId: session.user.id,
      paidByCashier: body.paidByCashier ?? 0,
      paidByOwner: body.paidByOwner ?? 0,
      shiftId: query.shiftId,
    });

    return NextResponse.json(toWriteOffResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
