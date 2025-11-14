import RoleGuard from "@/components/RoleGuard";

export default function ShiftLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard
            requiredRoles={["admin"]}
            loadingMessage="Перевірка адмін доступу..."
        >
            <div className="min-h-screen p-4">
                <div className="max-w-6xl mx-auto space-y-6">{children}</div>
            </div>
        </RoleGuard>
    );
}
