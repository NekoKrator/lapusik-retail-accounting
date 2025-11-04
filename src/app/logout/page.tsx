"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import LoadingScreen from "@/components/LoadingScreen";

export default function LogoutPage() {
    useEffect(() => {
        signOut({ callbackUrl: "/login" });
    }, []);

    return <LoadingScreen message="Вихід з облікового запису..." />;
}
