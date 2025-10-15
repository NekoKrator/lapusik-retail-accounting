"use client";

import { useEffect, useState, useMemo } from "react";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { DailyReport, StatsResponse, User } from "@/types/types";
import DashboardPeriodSelector from "./components/DashboardPeriodSelector";
import DashboardCards from "./components/DashboardCards";
import RevenueChart from "./components/RevenueChart";
import ExpensesBarChart from "./components/ExpensesBarChart";
import ExpensesPieChart from "./components/ExpensesPieChart";
import DailyReportsTable from "./components/DailyReportsTable";

export default function StatsPage() {
    const [allStats, setAllStats] = useState<StatsResponse | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<string>("all");

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
        const fetchData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    fetch(`/api/dashboard/stats`),
                    fetch(`/api/users?role=user`),
                ]);

                const statsData = await statsRes.json();
                const usersData = await usersRes.json();

                setAllStats(statsData);
                setUsers(usersData);
            } catch (err) {
                console.error("Failed to load stats or users", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function sumAllUsersByDate(dailyStats: DailyReport[]): DailyReport[] {
        if (!dailyStats || dailyStats.length === 0) return [];

        const aggregated = new Map<string, DailyReport>();

        for (const entry of dailyStats) {
            const key = entry.date;

            if (!aggregated.has(key)) {
                aggregated.set(key, {
                    date: entry.date,
                    morningBalance: 0,
                    additionalBalance: 0,
                    cashRegister: 0,
                    expenses: 0,
                    difference: 0,
                    expectedBalance: 0,
                    actualBalance: 0,
                    expensesByCategory: {},
                    firstRecordTime: new Date(
                        entry.createdAt || entry.date
                    ).getTime(),
                    lastRecordTime: new Date(
                        entry.createdAt || entry.date
                    ).getTime(),
                });
            }

            const dayAgg = aggregated.get(key)!;

            // Сумуємо всі числові поля
            dayAgg.morningBalance += entry.morningBalance ?? 0;
            dayAgg.additionalBalance += entry.additionalBalance ?? 0;
            dayAgg.cashRegister += entry.cashRegister ?? 0;
            dayAgg.expenses += entry.expenses ?? 0;
            dayAgg.difference += entry.difference ?? 0;
            dayAgg.expectedBalance += entry.expectedBalance ?? 0;
            dayAgg.actualBalance += entry.actualBalance ?? 0;

            // Сумуємо витрати по категоріях
            for (const [cat, val] of Object.entries(
                entry.expensesByCategory || {}
            )) {
                dayAgg.expensesByCategory[cat] =
                    (dayAgg.expensesByCategory[cat] || 0) + (val as number);
            }
        }

        return Array.from(aggregated.values());
    }

    // обробка і фільтрація статистики
    const filteredStats = useMemo(() => {
        if (!allStats) return null;

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        // фільтрація по датах
        let filtered = allStats.daily;
        if (fromDate && toDate) {
            filtered = filtered.filter((r) => {
                const d = new Date(r.date);
                return d >= fromDate && d <= toDate;
            });
        }

        // фільтрація по користувачу
        if (selectedUser !== "all") {
            filtered = filtered.filter((r) => r.userId === selectedUser);
        }

        // групування за userId + date
        const groupedMap = new Map<string, DailyReport>();

        for (const entry of filtered) {
            const key = `${entry.userId}-${entry.date}`;

            if (!groupedMap.has(key)) {
                groupedMap.set(key, {
                    userId: entry.userId,
                    date: entry.date,
                    morningBalance: entry.morningBalance ?? 0,
                    additionalBalance: 0,
                    cashRegister: 0,
                    expenses: 0,
                    difference: 0,
                    expensesByCategory: {},
                    expectedBalance: entry.expectedBalance ?? 0,
                    actualBalance: entry.actualBalance ?? 0,
                    firstRecordTime: new Date(
                        entry.createdAt || entry.date
                    ).getTime(),
                    lastRecordTime: new Date(
                        entry.createdAt || entry.date
                    ).getTime(),
                });
            }

            const agg = groupedMap.get(key)!;
            const entryTime = new Date(entry.createdAt || entry.date).getTime();

            // сумування числових показників
            agg.cashRegister += entry.cashRegister ?? 0;
            agg.additionalBalance += entry.additionalBalance ?? 0;
            agg.expenses += entry.expenses ?? 0;
            agg.difference += entry.difference ?? 0;

            // якщо поточний запис раніший — оновлюємо morningBalance
            if (entryTime < agg.firstRecordTime) {
                agg.morningBalance = entry.morningBalance ?? 0;
                agg.firstRecordTime = entryTime;
            }

            // якщо пізніший — оновлюємо evening balances
            if (entryTime > agg.lastRecordTime) {
                agg.expectedBalance =
                    entry.expectedBalance ?? agg.expectedBalance;
                agg.actualBalance = entry.actualBalance ?? agg.actualBalance;
                agg.lastRecordTime = entryTime;
            }

            // сумування витрат за категоріями
            for (const [cat, val] of Object.entries(entry.expensesByCategory)) {
                agg.expensesByCategory[cat] =
                    (agg.expensesByCategory[cat] || 0) + (val as number);
            }
        }

        let aggregatedDaily = Array.from(groupedMap.values());

        if (selectedUser === "all") {
            aggregatedDaily = sumAllUsersByDate(aggregatedDaily);
        }

        // загальна статистика
        const expensesByCategory: Record<string, number> = {};
        let totalIncome = 0;
        let totalExpenses = 0;
        let totalDifference = 0;

        for (const day of aggregatedDaily) {
            totalIncome +=
                (day.cashRegister ?? 0) + (day.additionalBalance ?? 0);
            totalExpenses += day.expenses ?? 0;
            totalDifference += day.difference ?? 0;

            for (const [key, value] of Object.entries(day.expensesByCategory)) {
                expensesByCategory[key] =
                    (expensesByCategory[key] || 0) + (value as number);
            }
        }

        return {
            ...allStats,
            daily: aggregatedDaily,
            expensesByCategory,
            totalIncome,
            totalExpenses,
            totalDifference,
        };
    }, [allStats, from, to, selectedUser]);

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
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
                <option value="all">Усі користувачі</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.username}
                    </option>
                ))}
            </select>

            {/* Період статистики */}
            <DashboardPeriodSelector
                from={from}
                to={to}
                onChangeRange={(newFrom, newTo) => {
                    setFrom(newFrom);
                    setTo(newTo);
                }}
            />

            {/* Якщо даних немає */}
            {!filteredStats ||
            !filteredStats.daily ||
            filteredStats.daily.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                    <p className="text-lg font-medium">Дані відсутні</p>
                    <p className="text-sm text-gray-500">
                        Спробуй змінити період або обрати іншого користувача.
                    </p>
                </div>
            ) : (
                <>
                    {/* Верхні картки */}
                    <DashboardCards data={filteredStats} />

                    {/* Графіки */}
                    <RevenueChart data={dailyWithFormattedDates} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ExpensesBarChart data={expensesData} />
                        <ExpensesPieChart data={expensesData} />
                    </div>

                    {/* Таблиця */}
                    <DailyReportsTable data={dailyWithFormattedDates} />
                </>
            )}
        </div>
    );
}
