"use client";

import { useEffect, useState } from "react";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { StatsResponse } from "@/types/types";
import { useSearchParams } from "next/navigation";
import DashboardPeriodSelector from "./components/DashboardPeriodSelector";
import DashboardCards from "./components/DashboardCards";
import RevenueChart from "./components/RevenueChart";
import ExpensesBarChart from "./components/ExpensesBarChart";
import ExpensesPieChart from "./components/ExpensesPieChart";
import DailyReportsTable from "./components/DailyReportsTable";

export default function StatsDashboardPage() {
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // беремо параметри з посилання
                const fromParam = searchParams.get("from");
                const toParam = searchParams.get("to");

                // дефолт — поточний місяць
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                const lastDay = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0
                );

                const from = fromParam || firstDay.toISOString().split("T")[0];
                const to = toParam || lastDay.toISOString().split("T")[0];

                const res = await fetch(
                    `/api/dashboard/stats?from=${from}&to=${to}`
                );
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [searchParams]);

    if (loading) {
        return <p className="p-6">Завантаження...</p>;
    }

    if (!stats) {
        return <p className="p-6 text-red-600">Не вдалося завантажити дані</p>;
    }

    const dailyWithFormattedDates = stats.daily.map((r) => ({
        ...r,
        formattedDate: new Date(r.date).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }),
    }));

    const expensesData = Object.entries(stats.expensesByCategory).map(
        ([key, value]) => {
            const category = expenseCategories.find((c) => c.key === key);
            return {
                category: category ? category.label : key,
                value,
            };
        }
    );

    return (
        <div className="p-6 space-y-6">
            {/* Період статистики */}
            <DashboardPeriodSelector />

            {/* Верхні картки */}
            <DashboardCards data={stats} />

            {/* Діаграми */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Лінійний графік виручки */}
                <RevenueChart data={dailyWithFormattedDates} />

                {/* Стовпчиковий графік витрат */}
                <ExpensesBarChart data={expensesData} />

                {/* Кругова діаграма структури витрат */}
                <ExpensesPieChart data={expensesData} />
            </div>

            {/* Таблиця щоденних звітів */}
            <DailyReportsTable data={dailyWithFormattedDates} />
        </div>
    );
}
