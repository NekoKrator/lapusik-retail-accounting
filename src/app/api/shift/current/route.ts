import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { toCurrentShiftResult } from "@/modules/shift/mappers";
import { getCurrentShift } from "@/modules/shift/service";
import { handlePrismaError } from "@/utils/error-handlers";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await getCurrentShift(session.user.id);

    return NextResponse.json(toCurrentShiftResult(result));
  } catch (err) {
    return handlePrismaError(err);
  }
}
