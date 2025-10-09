"use client";

import SupplierPage from "./suppliers/page";
import StatsPage from "./stats/page";

export default function AdminDashboardPage() {
    return (
        <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-6 space-y-6">
            <StatsPage />
            <SupplierPage />
        </div>
    );
}
