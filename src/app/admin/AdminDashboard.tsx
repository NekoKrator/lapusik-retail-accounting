"use client";

import SupplierPage from "./suppliers/page";
import StatsPage from "./stats/page";

export default function AdminDashboardPage() {
    return (
        <div>
            <StatsPage />
            <SupplierPage />
        </div>
    );
}
