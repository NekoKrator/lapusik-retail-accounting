"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { ExpensesPieChart } from "@/types/types";

export default function ExpensesPieChart({ data }: ExpensesPieChart) {
    return (
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle>Структура витрат</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        [
                                            "#2563eb",
                                            "#dc2626",
                                            "#16a34a",
                                            "#f59e0b",
                                        ][index % 4]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
