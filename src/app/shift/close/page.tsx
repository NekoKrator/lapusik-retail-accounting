"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";

interface Shift {
    id: string;
    openedAt: string;
    closedAt: string | null;
    openingBalance: number;
    actualClosingBalance: number | null;
    expensesBalance: number;
    isClosed: boolean;
}

export default function CloseShiftPage() {
    const router = useRouter();
    const [lastClosedShift, setLastClosedShift] = useState<Shift | null>(null);
    const [hasOpenShift, setHasOpenShift] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchShifts() {
            try {
                // Перевірка наявності відкритої зміни
                const openRes = await fetch("/api/shift?isClosed=false");
                if (!openRes.ok) throw new Error("Не вдалося перевірити зміну");
                const openData: Shift[] = await openRes.json();

                if (openData.length > 0) {
                    setHasOpenShift(true);
                }

                // Отримуємо останню закриту зміну
                const closedRes = await fetch("/api/shift?isClosed=true");
                if (!closedRes.ok) throw new Error("Не вдалося отримати зміни");
                const closedData: Shift[] = await closedRes.json();

                if (closedData.length > 0) {
                    setLastClosedShift(closedData[0]);
                } else {
                    setError("Немає закритих змін");
                }
            } catch (err) {
                console.error(err);
                setError("Помилка завантаження даних");
            } finally {
                setLoading(false);
            }
        }

        fetchShifts();
    }, []);

    if (loading) {
        return (
            <LoadingScreen message={"Завантаження даних закінчення зміни..."} />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                {error}
            </div>
        );
    }

    if (!lastClosedShift) return null;

    const openedAt = new Date(lastClosedShift.openedAt);
    const closedAt = lastClosedShift.closedAt
        ? new Date(lastClosedShift.closedAt)
        : null;
    const durationHours =
        closedAt && openedAt
            ? (
                  (closedAt.getTime() - openedAt.getTime()) /
                  (1000 * 60 * 60)
              ).toFixed(1)
            : null;

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white/95 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-center text-red-700">
                        Зміну закрито
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-500">
                            Зміна № {lastClosedShift.id}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Дата відкриття:</span>{" "}
                            {openedAt.toLocaleString("uk-UA")}
                        </p>
                        {closedAt && (
                            <p className="text-gray-600">
                                <span className="font-medium">
                                    Дата закриття:
                                </span>{" "}
                                {closedAt.toLocaleString("uk-UA")}
                            </p>
                        )}
                        {durationHours && (
                            <p className="text-gray-500 text-sm">
                                Тривалість: {durationHours} год
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4 space-y-2 text-center">
                        <p className="text-gray-700">
                            Початковий баланс:{" "}
                            <span className="font-semibold text-blue-600">
                                {lastClosedShift.openingBalance.toFixed(2)} ₴
                            </span>
                        </p>
                        <p className="text-gray-700">
                            Витрати за зміну:{" "}
                            <span className="font-semibold text-red-600">
                                {lastClosedShift.expensesBalance.toFixed(2)} ₴
                            </span>
                        </p>
                        <p className="text-gray-700">
                            Кінцевий баланс:{" "}
                            <span className="font-semibold text-green-600">
                                {lastClosedShift.actualClosingBalance?.toFixed(
                                    2
                                ) ?? "—"}{" "}
                                ₴
                            </span>
                        </p>
                    </div>

                    <div className="pt-6 text-center">
                        {hasOpenShift ? (
                            <Button
                                onClick={() => router.push("/shift/sales")}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                                Перейти до поточної зміни
                            </Button>
                        ) : (
                            <Button
                                onClick={() => router.push("/shift/open")}
                                className="bg-green-600 hover:bg-green-700 text-white w-full"
                            >
                                Розпочати нову зміну
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
