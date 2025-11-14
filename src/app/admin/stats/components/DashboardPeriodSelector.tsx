"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const periods = [
    { key: "day", label: "День" },
    { key: "week", label: "Тиждень" },
    { key: "month", label: "Місяць" },
    { key: "year", label: "Рік" },
];

type Props = {
    from: string;
    to: string;
    onChangeRange: (from: string, to: string) => void;
};

export default function DashboardPeriodSelector({
    from,
    to,
    onChangeRange,
}: Props) {
    const [customFrom, setCustomFrom] = useState(from);
    const [customTo, setCustomTo] = useState(to);
    const [activePeriod, setActivePeriod] = useState<string | null>("month");

    useEffect(() => {
        setCustomFrom(from);
        setCustomTo(to);
    }, [from, to]);

    const handleQuickSelect = (type: "day" | "week" | "month" | "year") => {
        const now = new Date();
        let fromDate: Date;
        const toDate = now;

        const subtractDays = (days: number) => {
            const d = new Date(now);
            d.setDate(now.getDate() - days);
            return d;
        };

        switch (type) {
            case "day":
                fromDate = now;
                break;
            case "week":
                fromDate = subtractDays(6);
                break;
            case "month":
                fromDate = subtractDays(29);
                break;
            case "year":
                fromDate = subtractDays(364);
                break;
        }

        const format = (d: Date) => d.toISOString().split("T")[0];

        const f = format(fromDate);
        const t = format(toDate);

        setActivePeriod(type);
        setCustomFrom(f);
        setCustomTo(t);
        onChangeRange(f, t);
    };

    const handleCustomChange = (fromVal: string, toVal: string) => {
        setCustomFrom(fromVal);
        setCustomTo(toVal);

        if (!fromVal || !toVal) return;
        if (fromVal > toVal) return;

        setActivePeriod("custom");
        onChangeRange(fromVal, toVal);
    };

    return (
        <Card className="shadow-xl border-0 bg-white">
            <CardContent className="flex flex-wrap items-center justify-between gap-4">
                {/* Кнопки періодів */}
                <div className="flex gap-2">
                    {periods.map((p) => (
                        <button
                            key={p.key}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
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
                </div>

                {/* Власний період */}
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={customFrom}
                        max={customTo || undefined} // Перша дата не більше другої
                        onChange={(e) =>
                            handleCustomChange(e.target.value, customTo)
                        }
                        className="border rounded px-2 py-1 text-sm"
                    />
                    <span className="text-gray-500">—</span>
                    <input
                        type="date"
                        value={customTo}
                        min={customFrom || undefined} // Друга дата не менше першої
                        onChange={(e) =>
                            handleCustomChange(customFrom, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
