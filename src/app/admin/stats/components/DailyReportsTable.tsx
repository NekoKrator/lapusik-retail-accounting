"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyReportsTable } from "@/types/types";

export default function DailyReportsTable({ data }: DailyReportsTable) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Щоденні звіти</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Дата</th>
                                <th className="px-4 py-2 text-right">Дохід</th>
                                <th className="px-4 py-2 text-right">
                                    Витрати
                                </th>
                                <th className="px-4 py-2 text-right">
                                    Очікуваний прибуток
                                </th>
                                <th className="px-4 py-2 text-right">
                                    Фактичний прибуток
                                </th>
                                <th className="px-4 py-2 text-right">
                                    Різниця
                                </th>
                                <th className="px-4 py-2 text-center">
                                    Підтверджено
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((report, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-4 py-2">
                                        {report.formattedDate}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {report.income.toFixed(2)} ₴
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {report.expenses.toFixed(2)} ₴
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {report.expectedBalance.toFixed(2)} ₴
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {report.actualBalance !== null
                                            ? `${report.actualBalance.toFixed(
                                                  2
                                              )} ₴`
                                            : "-"}
                                    </td>
                                    <td
                                        className={`px-4 py-2 text-right ${
                                            report.difference < 0
                                                ? "text-red-600"
                                                : "text-green-600"
                                        }`}
                                    >
                                        {report.difference.toFixed(2)} ₴
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {report.confirmed ? (
                                            <span className="text-green-600 font-medium">
                                                Так
                                            </span>
                                        ) : (
                                            <span className="text-red-600 font-medium">
                                                Ні
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
