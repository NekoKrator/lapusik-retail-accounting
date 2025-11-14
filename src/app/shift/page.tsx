"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatFullDateTime } from "@/lib/date";
import LoadingScreen from "@/components/LoadingScreen";
import {
    TypographyH3,
    TypographyMuted,
    TypographyP,
} from "@/components/ui/typography";
import { Spinner } from "@/components/ui/spinner";

interface Shift {
    id: string;
    actualClosingBalance: number | null;
    isClosed: boolean;
    closedAt?: string;
}

export default function ShiftPage() {
    const router = useRouter();
    const [balance, setBalance] = useState<number>(0);
    const [lastClosedDate, setLastClosedDate] = useState<string | null>(null);
    const [hasOpenShift, setHasOpenShift] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        async function checkOpenShift() {
            try {
                const res = await fetch("/api/shift?isClosed=false");
                if (!res.ok) throw new Error("Помилка при перевірці зміни");
                const openShifts: Shift[] = await res.json();

                if (openShifts.length > 0) {
                    setRedirecting(true);
                    router.push("/shift/sales");
                    return;
                }

                setHasOpenShift(false);
            } catch (err) {
                console.error(err);
            }
        }

        checkOpenShift();
    }, [router]);

    useEffect(() => {
        if (hasOpenShift === false) {
            async function fetchLastClosedShift() {
                try {
                    const res = await fetch("/api/shift?isClosed=true");
                    if (!res.ok)
                        throw new Error("Помилка при отриманні закритої зміни");
                    const closedShifts: Shift[] = await res.json();

                    if (closedShifts.length > 0) {
                        const last = closedShifts[0];
                        if (last.actualClosingBalance !== null)
                            setBalance(last.actualClosingBalance);
                        if (last.closedAt)
                            setLastClosedDate(
                                formatFullDateTime(last.closedAt)
                            );
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setFetching(false);
                }
            }

            fetchLastClosedShift();
        }
    }, [hasOpenShift]);

    async function handleOpenShift() {
        setLoading(true);
        const res = await fetch("/api/shift/open", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ openingBalance: balance }),
        });
        setLoading(false);

        if (res.ok) {
            router.push("/shift/sales");
        } else {
            alert("Помилка при відкритті зміни");
        }
    }

    if (redirecting) {
        return <LoadingScreen message={"Завантаження розпочатої зміни..."} />;
    }

    if (fetching) {
        return (
            <LoadingScreen message={"Завантаження даних початку зміни..."} />
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">
                        <TypographyH3>Розпочати робочу зміну</TypographyH3>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <TypographyP>Залишок з останньої зміни:</TypographyP>
                        <TypographyH3 className="text-primary">
                            {balance.toFixed(2)} ₴
                        </TypographyH3>
                        <TypographyMuted className="text-sm">
                            {lastClosedDate ? (
                                <>
                                    {"Закрито: "} {lastClosedDate}
                                </>
                            ) : (
                                "Даних про останню закриту зміну не знайдено"
                            )}
                        </TypographyMuted>
                    </div>

                    <Button
                        onClick={handleOpenShift}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? <Spinner /> : "Розпочати зміну"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
