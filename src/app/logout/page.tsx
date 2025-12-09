import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import { getServerSession } from "@/lib/get-session";

export default async function LogoutPage() {
  const session = await getServerSession();

  if (session) {
    await signOut();
    redirect("/auth");
  } else {
    redirect("/dashboard");
  }
}
