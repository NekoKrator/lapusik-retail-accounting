"use client";

import { useEffect, useState, useMemo } from "react";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { StatsResponse } from "@/types/types";
import DashboardPeriodSelector from "./components/DashboardPeriodSelector";
import DashboardCards from "./components/DashboardCards";
import RevenueChart from "./components/RevenueChart";
import ExpensesBarChart from "./components/ExpensesBarChart";
import ExpensesPieChart from "./components/ExpensesPieChart";
import DailyReportsTable from "./components/DailyReportsTable";

export default function StatsPage() {
    const [allStats, setAllStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");

    useEffect(() => {
        const now = new Date();
        const daysBefore = 29;
        const firstDay = new Date(now);
        firstDay.setDate(now.getDate() - daysBefore);

        const format = (d: Date) => d.toISOString().split("T")[0];
        setFrom(format(firstDay));
        setTo(format(now));
    }, []);

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

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        const daily =
            fromDate && toDate
                ? allStats.daily.filter((r) => {
                      const d = new Date(r.date);
                      return d >= fromDate && d <= toDate;
                  })
                : allStats.daily;

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
        } as StatsResponse & {
            daily: typeof allStats.daily;
            expensesByCategory: Record<string, number>;
            totalIncome: number;
            totalExpenses: number;
            totalDifference: number;
        };
    }, [allStats, from, to]);

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
            <DashboardPeriodSelector
                from={from}
                to={to}
                onChangeRange={(newFrom, newTo) => {
                    setFrom(newFrom);
                    setTo(newTo);
                }}
            />

            {/* Верхні картки */}
            <DashboardCards data={filteredStats} />

            <RevenueChart data={dailyWithFormattedDates} />

            {/* Діаграми */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExpensesBarChart data={expensesData} />
                <ExpensesPieChart data={expensesData} />
            </div>

            {/* Таблиця щоденних звітів */}
            <DailyReportsTable data={dailyWithFormattedDates} />
        </div>
    );
}
