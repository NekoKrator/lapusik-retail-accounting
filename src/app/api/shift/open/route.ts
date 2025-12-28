import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { validateRequest } from "@/lib/validate-request";
import { toOpenResult } from "@/modules/shift/mappers";
import { openShift } from "@/modules/shift/service";
import { ShiftOpenSchema } from "@/schemas/shift/shift-schema";
import { handlePrismaError } from "@/utils/error-handlers";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validate = validateRequest({
      bodySchema: ShiftOpenSchema,
    });

    const { error, data } = await validate(req);
    if (error) {
      return error;
    }

    const { body } = data;

    const result = await openShift(session.user.id, body.openingBalance);

    return NextResponse.json(toOpenResult(result), { status: 201 });
  } catch (err) {
    return handlePrismaError(err);
  }
}
