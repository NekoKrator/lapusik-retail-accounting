"use client";

import { format } from "date-fns";
import { BanknoteArrowDown, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
import { DialogWithTooltip } from "@/components/dialog-with-tooltip";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useShiftContext } from "@/context/shift-context";
import type { Debtor } from "@/generated/prisma/client";
import { useUpdateDebtor } from "@/hooks/api/debtor/use-update-debtor";
import { useWriteOffDebtor } from "@/hooks/api/debtor/use-write-off-debtor";
import { formatCurrency } from "@/lib/formatters";
import { WriteOffDebtorForm } from "./write-off-debtor-form";

type DebtorItemProps = {
  debtor: Debtor;
};

export default function DebtorItem({ debtor }: DebtorItemProps) {
  const { currentShift } = useShiftContext();

  const { mutateAsync: writeOffDebtor } = useWriteOffDebtor(currentShift.id);
  const { mutateAsync: updateDebtor } = useUpdateDebtor();

  const currentDebt = useMemo(
    () => debtor.debt - debtor.paid,
    [debtor.debt, debtor.paid]
  );

  const handleWriteOff = async (payload: { paid: number }) => {
    await writeOffDebtor({
      id: debtor.id,
      payload,
    });
    toast.success("Списання успішно завершено!", {
      description: `Створено надходження на ${payload.paid} ₴.`,
    });
  };

  const handleRemove = async (id: string) => {
    await updateDebtor({
      id,
      payload: { paid: 0, debt: 0, isPaidOff: true },
    });
    toast.success("Боржника успішно видалено!");
  };

  return (
    <Item className="h-20" variant="outline">
      {/* Name and Time */}
      <ItemContent className="overflow-hidden">
        <ItemTitle>
          <ResponsiveTooltip delayDuration={300} message={debtor.name}>
            <p className="truncate text-base">{debtor.name}</p>
          </ResponsiveTooltip>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 truncate">
          {format(debtor.createdAt, "dd.MM.yy, kk:mm")}
        </ItemDescription>
      </ItemContent>

      {/* Current Debt */}
      <ItemContent>
        <ItemDescription className="font-semibold text-base text-orange-600">
          {formatCurrency(currentDebt)}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Write Off Debtor */}
        <DialogWithTooltip
          description={`Боржник: ${debtor.name}`}
          title="Списати борг"
          tooltipContent="Списати борг"
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-orange-50 hover:text-orange-600"
              type="button"
              variant="ghost"
            >
              <BanknoteArrowDown className="h-4 w-4" />
            </Button>
          }
        >
          <WriteOffDebtorForm onWriteOff={handleWriteOff} />
        </DialogWithTooltip>

        {/* Remove Debtor */}
        <AlertDialogDestructive
          applyButtonName="Видалити борг"
          description="Дані про поточний борг будуть безповоротно видалені. Відповідні дані про витрати та надходження залишаться."
          onDelete={() => handleRemove(debtor.id)}
          title={`Ви впевнені, що хочете видалити боржника: ${debtor.name}?`}
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-red-50 hover:text-destructive"
              type="button"
              variant="ghost"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          }
        />
      </ItemActions>
    </Item>
  );
}
