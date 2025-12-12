"use client";

import { format } from "date-fns";
import LoadingScreen from "@/components/loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  TypographyH3,
  TypographyMuted,
  TypographyP,
} from "@/components/ui/typography";
import type { Shift } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/formatters";
import { useOpenShift } from "../../../hooks/api/shift/use-open-shift";

type OpenShiftProps = {
  isLoading: boolean;
  lastClosedShift: Shift | undefined | null;
};

export default function OpenShift({
  isLoading,
  lastClosedShift,
}: OpenShiftProps) {
  const openShift = useOpenShift();

  if (isLoading) {
    return <LoadingScreen message="Перевірка активної зміни..." />;
  }

  const closingBalance = lastClosedShift?.actualClosingBalance ?? 0;
  const closingDate = lastClosedShift?.closedAt;

  function handleOpenShift() {
    openShift.mutate({ openingBalance: closingBalance });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            <TypographyH3>Розпочати робочу зміну</TypographyH3>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-center">
          <TypographyP>Ранковий залишок:</TypographyP>

          <TypographyH3 className="text-primary">
            {formatCurrency(closingBalance)}
          </TypographyH3>
          <TypographyMuted className="text-sm">
            {closingDate ? (
              <>
                {"Закрито: "} {format(closingDate, "dd.MM.yy, HH:mm")}
              </>
            ) : (
              "Даних про останню закриту зміну не знайдено"
            )}
          </TypographyMuted>

          <Button
            className="mt-4 w-full"
            disabled={openShift.isPending}
            onClick={handleOpenShift}
          >
            {openShift.isPending ? <Spinner /> : "Розпочати зміну"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
