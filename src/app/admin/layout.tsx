import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TablesProvider } from "@/context/tables-context";
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
    <TablesProvider>
      <SidebarProvider>
        <SidebarAdmin />
        <main className="w-screen overflow-hidden bg-background">
          <div className="h-full py-4 md:py-6">{children}</div>
        </main>
      </SidebarProvider>
    </TablesProvider>
  );
}
