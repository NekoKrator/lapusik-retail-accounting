import { Receipt } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { ResultItem } from "@/components/result-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { LocalStorageDraft } from "@/types/types";

type CashRegisterProps = {
  terminalRegister: number | null;
  totalCashRegister: number | null;
  onTotalCashRegisterChange: Dispatch<SetStateAction<LocalStorageDraft>>;
};

export function CashRegister({
  terminalRegister,
  totalCashRegister,
  onTotalCashRegisterChange,
}: CashRegisterProps) {
  const handleCashChange = (value: string) => {
    onTotalCashRegisterChange((prev) => {
      if (value === "") {
        return { ...prev, totalCashRegister: null };
      }

      return { ...prev, totalCashRegister: Number(value) };
    });
  };

  const handleTerminalChange = (value: string) => {
    onTotalCashRegisterChange((prev) => {
      if (value === "") {
        return { ...prev, terminalRegister: null };
      }

      return { ...prev, terminalRegister: Number(value) };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-7 w-7 text-green-600" />
          <TypographyH3>Виторг</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="totalCashRegister">Усього*</Label>
            <Input
              id="totalCashRegister"
              max="9999999"
              min="0"
              onChange={(e) => handleCashChange(e.target.value)}
              placeholder="0,00"
              type="number"
              value={totalCashRegister ?? ""}
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="terminal">Термінал*</Label>
            <Input
              id="terminal"
              max="9999999"
              min="0"
              onChange={(e) => handleTerminalChange(e.target.value)}
              placeholder="0,00"
              type="number"
              value={terminalRegister ?? ""}
            />
          </div>
        </div>

        <ResultItem
          label="Виторг за зміну"
          value={formatCurrency(totalCashRegister ?? 0)}
          variant="green"
        />
      </CardContent>
    </Card>
  );
}
