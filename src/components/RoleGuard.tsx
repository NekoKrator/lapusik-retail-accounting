"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import type { RoleGuardProps, UserRole } from "@/types/types";

export default function RoleGuard({
    requiredRoles,
    children,
    loadingMessage = "Перевірка доступу...",
    redirectMessage = "Перенаправлення...",
}: RoleGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const userRole = session?.user?.role as UserRole | undefined;

    useEffect(() => {
        if (status === "loading") return;

        if (!userRole || !requiredRoles.includes(userRole)) {
            router.replace("/login");
        }
    }, [session, status, userRole, router, requiredRoles]);

    if (status === "loading") {
        return <LoadingScreen message={loadingMessage} />;
    }

    if (!userRole || !requiredRoles.includes(userRole)) {
        return <LoadingScreen message={redirectMessage} />;
    }

    return <>{children}</>;
}
