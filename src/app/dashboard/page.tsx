import { redirect } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";
import { getServerSession } from "@/lib/get-session";

export default async function RedirectPage() {
  const session = await getServerSession();

  if (session) {
    switch (session.user.role) {
      case "admin":
        redirect("/admin/suppliers");
        break;
      case "user":
        redirect("/shift");
        break;
      default:
        redirect("/logout");
    }
  }

  if (!session) {
    redirect("/auth");
  }

  return <LoadingScreen message="Перенаправлення..." />;
}
