"use client";
import RoleGuard from "@/components/RoleGuard";
import SalesDashboardPage from "./SalesPage";

export default function SalesPage() {
    return (
        <RoleGuard
            requiredRoles={["user", "admin"]}
            loadingMessage="Перевірка доступу до продажів..."
        >
            <SalesDashboardPage />
        </RoleGuard>
    );
}
