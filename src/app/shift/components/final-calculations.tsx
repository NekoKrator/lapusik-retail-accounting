import { AlertCircle, Calculator, CheckCircle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { ResultItem } from "@/components/result-item";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TypographyH3 } from "@/components/ui/typography";
import { formatCurrency } from "@/lib/formatters";
import type { LocalStorageDraft } from "@/types/types";

type FinalCalculationsProps = {
  expectedClosingBalance: number | null;
  actualClosingBalance: number | null;
  onActualClosingBalanceChange: Dispatch<SetStateAction<LocalStorageDraft>>;
  difference: number | null;
};

export function FinalCalculations({
  expectedClosingBalance,
  actualClosingBalance,
  onActualClosingBalanceChange,
  difference,
}: FinalCalculationsProps) {
  const getDifferenceClasses = (diff: number) => {
    if (diff === 0) {
      return "border-green-200 bg-green-50 text-green-600 dark:border-green-600/20 dark:bg-green-600/10";
    }

    if (diff > 0) {
      return "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-600/20 dark:bg-orange-600/10";
    }

    return "border-red-200 bg-red-50 text-red-600 dark:border-red-600/20 dark:bg-red-600/10";
  };

  const handleActualClosingBalanceChange = (value: string) => {
    onActualClosingBalanceChange((prev) => {
      if (value === "") {
        return { ...prev, actualClosingBalance: null };
      }

      return { ...prev, actualClosingBalance: Number(value) };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-7 w-7 text-yellow-600" />
          <TypographyH3>Підсумки</TypographyH3>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <ResultItem
          label="Розрахунковий залишок"
          value={formatCurrency(expectedClosingBalance ?? 0)}
          variant="yellow"
        />

        <div className="space-y-3">
          <Label htmlFor="actualClosingBalance">Фактичний залишок*</Label>

          <Input
            id="actualClosingBalance"
            min="0"
            onChange={(e) => handleActualClosingBalanceChange(e.target.value)}
            placeholder="Введіть після підрахунку каси"
            type="number"
            value={actualClosingBalance ?? ""}
          />

          {difference != null && (
            <Alert
              className={`flex justify-center [&>svg]:size-5 ${getDifferenceClasses(difference)}`}
            >
              {difference === 0 ? <CheckCircle /> : <AlertCircle />}
              <AlertTitle className="items-center text-base">
                Різниця: {formatCurrency(Math.abs(difference))}
                {difference < 0 && " (надлишок)"}
                {difference > 0 && " (нестача)"}
                {difference === 0 && " (збігається)"}
              </AlertTitle>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
