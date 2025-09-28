"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    TrendingUp,
    Wallet,
    ArrowDownCircle,
    AlertTriangle,
} from "lucide-react";
import type { DashboardCards } from "@/types/types";

export default function DashboardCards({ data }: DashboardCards) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Дохід</CardTitle>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{data.totalIncome} ₴</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Витрати</CardTitle>
                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{data.totalExpenses} ₴</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Прибуток</CardTitle>
                    <Wallet className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        {data.totalIncome - data.totalExpenses} ₴
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Різниця</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">
                        {data.totalDifference} ₴
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
