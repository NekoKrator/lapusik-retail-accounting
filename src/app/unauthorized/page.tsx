"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center text-center">
            <div className="flex flex-col items-center justify-center gap-4">
                <TypographyH1>Доступ заборонено</TypographyH1>
                <TypographyMuted className="text-base">
                    У вас немає прав доступу до цієї сторінки.
                </TypographyMuted>
                <Button onClick={() => router.push("/dashboard")}>
                    Повернутися до обліку
                </Button>
            </div>
        </div>
    );
}
