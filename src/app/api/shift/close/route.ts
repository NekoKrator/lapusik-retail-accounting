import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toCloseResult } from "@/modules/shift/mappers";
import { closeShift } from "@/modules/shift/service";
import { ShiftCloseSchema } from "@/schemas/shift/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validate = validateRequest({
      bodySchema: ShiftCloseSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await closeShift(session.user.id, body);

    return NextResponse.json(toCloseResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
