"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-bold mb-4">Доступ заборонено</h1>
                <p className="text-gray-600 mb-6">
                    У вас немає прав доступу до цієї сторінки.
                </p>
                <Button onClick={() => router.push("/dashboard")}>
                    Повернутися до обліку
                </Button>
            </div>
        </div>
    );
}
