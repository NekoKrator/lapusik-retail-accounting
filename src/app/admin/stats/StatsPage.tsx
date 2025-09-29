"use client";

import { useEffect, useState, useMemo } from "react";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { StatsResponse } from "@/types/types";
import { useSearchParams } from "next/navigation";
import DashboardPeriodSelector from "./components/DashboardPeriodSelector";
import DashboardCards from "./components/DashboardCards";
import RevenueChart from "./components/RevenueChart";
import ExpensesBarChart from "./components/ExpensesBarChart";
import ExpensesPieChart from "./components/ExpensesPieChart";
import DailyReportsTable from "./components/DailyReportsTable";

export default function StatsPage() {
    const [allStats, setAllStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`/api/dashboard/stats`);
                const data = await res.json();
                setAllStats(data);
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // обробляємо параметри дат
    const filteredStats = useMemo(() => {
        if (!allStats) return null;

        const fromParam = searchParams.get("from");
        const toParam = searchParams.get("to");

        // дефолт — поточний місяць
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const from = new Date(fromParam || firstDay);
        const to = new Date(toParam || lastDay);

        // фільтруємо daily
        const daily = allStats.daily.filter((r) => {
            const d = new Date(r.date);
            return d >= from && d <= to;
        });

        const expensesByCategory: Record<string, number> = {};
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalDifference = 0;

        for (const day of daily) {
            totalIncome += day.income ?? 0;
            totalExpenses += day.expenses ?? 0;
            totalDifference += day.difference ?? 0;

            for (const [key, value] of Object.entries(day.expensesByCategory)) {
                expensesByCategory[key] =
                    (expensesByCategory[key] || 0) + (value as number);
            }
        }

        return {
            ...allStats,
            daily,
            expensesByCategory,
            totalIncome,
            totalExpenses,
            totalDifference,
        };
    }, [allStats, searchParams]);

    if (loading) {
        return <p className="p-6">Завантаження...</p>;
    }

    if (!filteredStats) {
        return <p className="p-6 text-red-600">Не вдалося завантажити дані</p>;
    }

    const dailyWithFormattedDates = filteredStats.daily.map((r) => ({
        ...r,
        formattedDate: new Date(r.date).toLocaleDateString("uk-UA", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        }),
    }));

    const expensesData = Object.entries(filteredStats.expensesByCategory)
        .filter(([key]) => expenseCategories.some((c) => c.key === key))
        .map(([key, value]) => {
            const category = expenseCategories.find((c) => c.key === key)!;
            return {
                category: category.label,
                value,
            };
        });

    return (
        <div className="space-y-6">
            {/* Період статистики */}
            <DashboardPeriodSelector />

            {/* Верхні картки */}
            <DashboardCards data={filteredStats} />

            {/* Діаграми */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart data={dailyWithFormattedDates} />
                <ExpensesBarChart data={expensesData} />
                <ExpensesPieChart data={expensesData} />
            </div>

            {/* Таблиця щоденних звітів */}
            <DailyReportsTable data={dailyWithFormattedDates} />
        </div>
    );
}
