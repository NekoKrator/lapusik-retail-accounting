"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    BarChart,
    Bar,
} from "recharts";
import type { ExpensesBarChart } from "@/types/types";

export default function ExpensesBarChart({ data }: ExpensesBarChart) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const tooltipFormatter = (value: number, name: string) => {
        return [`${value} ₴`];
    };

    return (
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader>
                <CardTitle>Витрати по категоріях</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data.sort((a, b) => b.value - a.value)}
                        layout="vertical"
                        margin={{ left: 100 }}
                    >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="category" />
                        <Tooltip formatter={tooltipFormatter} />
                        <Bar dataKey="value">
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
