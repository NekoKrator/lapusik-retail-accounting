"use client";

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { BanknoteArrowDown, X } from "lucide-react";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
import { Dialog } from "@/components/dialog";
import { DialogDescriptionInfoRow } from "@/components/dialog-description-info-row";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShiftContext } from "@/context/shift-context";
import { useCancelDebts } from "@/hooks/api/debt/use-cancel-debts";
import { useWriteOffDebtor } from "@/hooks/api/debtor/use-write-off-debtor";
import { formatCurrency } from "@/lib/formatters";
import type { DebtListItem } from "@/modules/debt/contracts";
import type { DebtorListItem } from "@/modules/debtor/contracts";
import { WriteOffDebtorForm } from "./write-off-debtor-form";

type DebtorItemProps = {
  debtor: DebtorListItem;
};

export default function DebtorItem({ debtor }: DebtorItemProps) {
  const { currentShift } = useShiftContext();

  const { id: debtorId, name, debts } = debtor;
  const currentDebt = debts.reduce(
    (acc, item) => acc + item.amount - item.paidAmount,
    0
  );
  const formattedCurrentDebt = formatCurrency(currentDebt);
  const lastDebtDate = debts.at(-1)?.createdAt;
  const formattedLastDebtCreatedAt = lastDebtDate
    ? format(lastDebtDate, "dd MMMM, HH:mm", { locale: uk })
    : "Боргів не знайдено";

  const { mutateAsync: writeOffDebtor, isPending: isPendingWriteOff } =
    useWriteOffDebtor({
      shiftId: currentShift.id,
    });

  const { mutateAsync: cancelDebts, isPending: isPendingCancel } =
    useCancelDebts({ debtorId });

  const handleWriteOff = async (payload: { writeOffAmount: number }) => {
    await writeOffDebtor({
      id: debtor.id,
      payload,
    });
    toast.success("Списання успішно завершено!", {
      description: `Створено надходження на ${payload.writeOffAmount} ₴.`,
    });
  };

  const handleCancel = async () => {
    await cancelDebts();
    toast.success("Борги успішно анульовано!");
  };

  return (
    <Item className="h-20" variant="outline">
      <ItemContent className="overflow-hidden">
        {/* Name */}
        <ItemTitle>
          <p className="truncate text-base" title={name}>
            {name}
          </p>
        </ItemTitle>

        {/* Last Debt Created At */}
        <ItemDescription className="truncate opacity-70">
          {formattedLastDebtCreatedAt}
        </ItemDescription>
      </ItemContent>

      {/* Current Debt */}
      <ItemContent>
        <ItemDescription className="font-semibold text-base text-orange-600">
          {formattedCurrentDebt}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Write Off Debt */}
        <Dialog
          description={
            <DebtorDialogDescription
              currentDebt={formattedCurrentDebt}
              debtorName={name}
              debts={debts}
            />
          }
          title={
            <div className="flex items-center gap-4">
              <BanknoteArrowDown className="text-orange-600" /> Списати борг
            </div>
          }
          tooltipMessage="Списати борг"
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-orange-50 hover:text-orange-600"
              disabled={isPendingCancel}
              type="button"
              variant="ghost"
            >
              <BanknoteArrowDown className="h-4 w-4" />
            </Button>
          }
        >
          <WriteOffDebtorForm onWriteOff={handleWriteOff} />
        </Dialog>

        {/* Remove Debtor */}
        <AlertDialogDestructive
          applyButtonName="Анулювати борги"
          description={
            <div className="flex flex-col gap-4">
              <DebtorDialogDescription
                currentDebt={formattedCurrentDebt}
                debtorName={name}
                debts={debts}
              />
              <div className="flex flex-col">
                <p>
                  Дані про пов'язані витрати та надходження{" "}
                  <span className="font-bold">залишаться</span>.
                </p>
              </div>
            </div>
          }
          onDelete={handleCancel}
          title="Ви впевнені, що хочете анулювати борги?"
          tooltipMessage="Анулювати борги"
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-red-50 hover:text-destructive"
              disabled={isPendingWriteOff}
              type="button"
              variant="ghost"
            >
              <X />
            </Button>
          }
        />
      </ItemActions>
    </Item>
  );
}

const DebtorDialogDescription = ({
  debtorName,
  currentDebt,
  debts,
}: {
  debtorName: string;
  currentDebt: string;
  debts: DebtListItem[];
}) => (
  <div className="flex flex-col gap-2 text-muted-foreground text-sm">
    <div>
      <DialogDescriptionInfoRow label="Боржник" value={debtorName} />
      <DialogDescriptionInfoRow label="Борг" value={currentDebt} />
    </div>

    <div className="rounded-md border p-1">
      <ScrollArea className="h-20" type="always">
        {debts
          .filter((item) => item.status === "ACTIVE")
          .map((item) => {
            const createdAt = format(item.createdAt, "dd MMMM, HH:mm", {
              locale: uk,
            });
            const curDebt = item.amount - item.paidAmount;
            const formattedCurDebt = formatCurrency(curDebt);
            return (
              <DialogDescriptionInfoRow
                className="pr-3 pl-2"
                key={item.id}
                label={createdAt}
                value={formattedCurDebt}
              />
            );
          })}
      </ScrollArea>
    </div>
  </div>
);
