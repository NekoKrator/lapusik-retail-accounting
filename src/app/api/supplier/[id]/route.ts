import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toUpdateResult } from "@/modules/supplier/mappers";
import { updateSupplier } from "@/modules/supplier/repository";
import { SupplierUpdateSchema } from "@/schemas/supplier/supplier-schema";
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

    const result = await updateSupplier(id, body);

    return NextResponse.json(toUpdateResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
