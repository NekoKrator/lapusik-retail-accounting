"use client";

import RoleGuard from "@/components/RoleGuard";

export default function ShiftLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard
            requiredRoles={["user"]}
            loadingMessage="Перевірка доступу до продажів..."
        >
            {children}
        </RoleGuard>
    );
}
