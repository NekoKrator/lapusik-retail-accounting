"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import type { RoleGuardProps } from "@/types/types";

export default function RoleGuard({
    requiredRole,
    children,
    loadingMessage = "Перевірка доступу...",
    redirectMessage = "Перенаправлення...",
}: RoleGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session || session.user.role !== requiredRole) {
            router.push("/login");
        }
    }, [session, status, router, requiredRole]);

    if (status === "loading") {
        return <LoadingScreen message={loadingMessage} />;
    }

    if (!session || session.user.role !== requiredRole) {
        return <LoadingScreen message={redirectMessage} />;
    }

    return <>{children}</>;
}
