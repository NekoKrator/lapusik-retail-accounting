import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl space-y-6">{children}</div>
    </div>
  );
}
