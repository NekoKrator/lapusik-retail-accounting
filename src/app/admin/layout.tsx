import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "@/lib/get-session";
import { SidebarAdmin } from "./components/sidebar-admin";

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
    <SidebarProvider>
      <SidebarAdmin />
      <main className="w-screen overflow-hidden">{children}</main>
    </SidebarProvider>
  );
}
