"use client";
import RoleGuard from "@/components/RoleGuard";
import AdminDashboardPage from "./AdminDashboard";

export default function AdminPage() {
    return (
        <RoleGuard
            requiredRoles={["admin"]}
            loadingMessage="Перевірка адмін доступу..."
        >
            <AdminDashboardPage />
        </RoleGuard>
    );
}
