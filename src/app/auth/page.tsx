import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import AuthClientPage from "./auth-client";

export default async function AuthPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <AuthClientPage />;
}
