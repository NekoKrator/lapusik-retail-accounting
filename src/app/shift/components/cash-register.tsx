import { Receipt } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { ResultItem } from "@/components/result-item";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { LocalStorageDraft } from "@/types/types";

type CashRegisterProps = {
  totalCashRegister: number | null;
  onTotalCashRegisterChange: Dispatch<SetStateAction<LocalStorageDraft>>;
};

export function CashRegister({
  totalCashRegister,
  onTotalCashRegisterChange,
}: CashRegisterProps) {
  const handleTotalCashRegisterChange = (value: string) => {
    onTotalCashRegisterChange((prev) => {
      if (value === "") {
        return { ...prev, totalCashRegister: null };
      }

      return { ...prev, totalCashRegister: Number(value) };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-7 w-7 text-green-600" />
          <TypographyH3>Виторг</TypographyH3>
        </CardTitle>
        <CardDescription>
          <TypographyP>Загальна сума готівки та терміналу за зміну</TypographyP>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-6">
        <Input
          id="cashRegister"
          max="9999999"
          min="0"
          onChange={(e) => handleTotalCashRegisterChange(e.target.value)}
          placeholder="0,00"
          type="number"
          value={totalCashRegister ?? ""}
        />

        <ResultItem
          label="Виторг за зміну"
          value={formatCurrency(totalCashRegister ?? 0)}
          variant="green"
        />
      </CardContent>
    </Card>
  );
}
