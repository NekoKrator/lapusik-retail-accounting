"use client";

import { Suspense } from "react";
import StatsDashboardPage from "./StatsPage";

export default function StatsPage() {
    return (
        <Suspense fallback={<p className="p-6">Завантаження...</p>}>
            <StatsDashboardPage />
        </Suspense>
    );
}
