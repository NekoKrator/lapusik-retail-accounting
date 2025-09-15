"use client";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status !== "loading") {
            if (!session?.user?.role) {
                router.push("/login");
                return;
            }

            switch (session.user.role) {
                case "admin":
                    router.push("/admin");
                    break;
                case "user":
                    router.push("/sales");
                    break;
                default:
                    router.push("/login");
            }
        }
    }, [status, session, router]);

    if (status === "loading") {
        return <LoadingScreen message="Перевірка авторизації..." />;
    }

    return (
        <LoadingScreen message="Перенаправлення, будь ласка, зачекайте..." />
    );
}
