"use client";

import { useSession } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <LoadingScreen message="Перенаправлення..." />;
    } else {
        router.replace("/dashboard");
    }
}
