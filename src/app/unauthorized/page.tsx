"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH1, TypographyMuted } from "@/components/ui/typography";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm p-8">
        <CardHeader>
          <CardTitle>
            <TypographyH1>Доступ заборонено</TypographyH1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TypographyMuted className="text-center text-base">
            У вас немає прав доступу до цієї сторінки.
          </TypographyMuted>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => router.push("/dashboard")}>
            Повернутися до обліку
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
