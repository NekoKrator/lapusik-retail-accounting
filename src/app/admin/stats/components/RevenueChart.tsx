"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { RevenueChart } from "@/types/types";

export default function RevenueChart({ data }: RevenueChart) {
    const tooltipFormatter = (value: number, name: string) => {
        let label;
        if (name === "cashRegister") label = "Доходи";
        else if (name === "expenses") label = "Витрати";
        else label = name;
        return [`${value} ₴`, label];
    };

    return (
        <Card className="shadow-xl border-0 bg-white/95">
            <CardHeader>
                <CardTitle>Динаміка доходів/витрат</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="formattedDate" />
                        <YAxis />
                        <Tooltip formatter={tooltipFormatter} />
                        <Area
                            type="monotone"
                            dataKey="cashRegister"
                            stroke="#2563eb"
                            fill="#2563eb"
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#eb2525ff"
                            fill="#eb2525ff"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
