"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

interface Shift {
    id: string;
    isClosed: boolean;
    openingBalance: number;
    closingBalance: number | null;
}

export default function SalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [hasActiveShift, setHasActiveShift] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function checkShift() {
            try {
                const res = await fetch("/api/shift?isClosed=false");
                if (!res.ok) throw new Error("Помилка при перевірці зміни");

                const data: Shift[] = await res.json();

                if (data.length === 0) {
                    router.replace("/shift/open");
                    return;
                }

                setHasActiveShift(true);
            } catch (err) {
                console.error("Помилка перевірки зміни:", err);
                router.replace("/shift/open");
            } finally {
                setLoading(false);
            }
        }

        checkShift();
    }, [router]);

    if (loading) {
        return <LoadingScreen message={"Перевірка активної зміни..."} />;
    }

    if (!hasActiveShift) {
        return null;
    }

    return <>{children}</>;
}
