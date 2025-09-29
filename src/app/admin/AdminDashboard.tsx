"use client";

import SupplierPage from "./suppliers/page";
import StatsPage from "./stats/page";

export default function AdminDashboardPage() {
    return (
        <div className="p-6 space-y-6">
            <StatsPage />
            <SupplierPage />
        </div>
    );
}
