import { NextResponse } from "next/server";
import { getServerSession } from "./get-session";

export async function requireAuth(roles?: string[]) {
  const session = await getServerSession();

  if (!session) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (roles && roles.length > 0) {
    const userRole = session.user.role;
    if (!(userRole && roles.includes(userRole))) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }
  }

  return { session };
}
