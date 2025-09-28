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
    return (
        <Card>
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
                        <Tooltip />
                        <Bar dataKey="value">
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        [
                                            "#2563eb",
                                            "#16a34a",
                                            "#f59e0b",
                                            "#dc2626",
                                        ][index % 4]
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
