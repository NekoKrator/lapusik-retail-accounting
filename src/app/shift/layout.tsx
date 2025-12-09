import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export default async function ShiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "user") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
