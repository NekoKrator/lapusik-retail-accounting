"use client";
import RoleGuard from "@/components/RoleGuard";
import SalesDashboardPage from "./SalesPage";

export default function SalesPage() {
    return (
        <RoleGuard
            requiredRole="user"
            loadingMessage="Перевірка доступу до продажів..."
        >
            <SalesDashboardPage />
        </RoleGuard>
    );
}
