"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    PieLabelRenderProps,
} from "recharts";
import type { ExpensesPieChart } from "@/types/types";

export default function ExpensesPieChart({ data }: ExpensesPieChart) {
    const RADIAN = Math.PI / 180;
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const filteredData = data.filter((item) => item.value !== 0);

    const renderCustomizedLabel = (props: PieLabelRenderProps) => {
        const cx = Number(props.cx ?? 0);
        const cy = Number(props.cy ?? 0);
        const midAngle = Number(props.midAngle ?? 0);
        const innerRadius = Number(props.innerRadius ?? 0);
        const outerRadius = Number(props.outerRadius ?? 0);
        const percent = Number(props.percent ?? 0);

        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const tooltipFormatter = (value: number, name: string) => {
        return [`${value} ₴`, name];
    };

    return (
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
            <CardHeader>
                <CardTitle>Структура витрат</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={filteredData}
                            dataKey="value"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={tooltipFormatter} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
