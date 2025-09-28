"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { RevenueChart } from "@/types/types";

export default function RevenueChart({ data }: RevenueChart) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Динаміка доходів/витрат</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <XAxis dataKey="formattedDate" />
                        <YAxis />
                        <Tooltip
                            formatter={(value, name) => {
                                let label;
                                if (name === "income") {
                                    label = "Доходи";
                                } else if (name === "expenses") {
                                    label = "Витрати";
                                } else {
                                    label = name;
                                }
                                return [`${value} грн`, label];
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="expenses"
                            stroke="#eb2525ff"
                            strokeWidth={2}
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#2563eb"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
