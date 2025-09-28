"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const periods = [
    { key: "day", label: "День" },
    { key: "week", label: "Тиждень" },
    { key: "month", label: "Місяць" },
    { key: "year", label: "Рік" },
];

export default function DashboardPeriodSelector() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [activePeriod, setActivePeriod] = useState<string | null>(null);

    const setRange = (from: Date, to: Date) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("from", from.toISOString().split("T")[0]);
        params.set("to", to.toISOString().split("T")[0]);
        router.push(`?${params.toString()}`);
    };

    const handleQuickSelect = (type: "day" | "week" | "month" | "year") => {
        const now = new Date();
        let from: Date;
        const to: Date = now;

        switch (type) {
            case "day":
                from = now;
                break;
            case "week": {
                const firstDayOfWeek = new Date(now);
                const day = now.getDay();
                const diff = day === 0 ? -6 : 1 - day;
                firstDayOfWeek.setDate(now.getDate() + diff);
                from = firstDayOfWeek;
                break;
            }
            case "month":
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "year":
                from = new Date(now.getFullYear(), 0, 1);
                break;
        }

        setActivePeriod(type);
        setRange(from, to);
    };

    const handleCustomApply = () => {
        if (!customFrom || !customTo) return;
        const from = new Date(customFrom);
        const to = new Date(customTo);
        setActivePeriod("custom");
        setRange(from, to);
    };

    return (
        <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
                {/* Кнопки періодів */}
                <div className="flex gap-2">
                    {periods.map((p) => (
                        <button
                            key={p.key}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                    activePeriod === p.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                            onClick={() =>
                                handleQuickSelect(
                                    p.key as "day" | "week" | "month" | "year"
                                )
                            }
                        >
                            {p.label}
                        </button>
                    ))}
                    <button
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                  activePeriod === "custom"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
                        onClick={handleCustomApply}
                        disabled={!customFrom || !customTo}
                    >
                        Власний
                    </button>
                </div>

                {/* Власний період */}
                <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-gray-50">
                    <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">—</span>
                    <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
