import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
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
import { useDeleteAdditionalIncome } from "@/hooks/api/additional-income/use-delete-additional-income";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";

type AdditionalIncomeItemProps = {
  additionalIncome: AdditionalIncomeWithDebtor;
};

export default function AdditionalIncomeItem({
  additionalIncome,
}: AdditionalIncomeItemProps) {
  const { currentShift } = useShiftContext();
  const { mutateAsync: deleteAdditionalIncome } = useDeleteAdditionalIncome({
    shiftId: currentShift.id,
  });

  const debtorName =
    additionalIncome?.debtor?.name != null ? additionalIncome.debtor.name : "";

  const fullIncomeTitle = debtorName
    ? `${additionalIncome.category} (${debtorName})`
    : additionalIncome.category;

  const handleDelete = async () => {
    await deleteAdditionalIncome(additionalIncome.id);
    toast.success("Надходження успішно видалено!");
  };

  return (
    <Item className="h-20" variant="outline">
      <ItemContent className="overflow-hidden">
        <ItemTitle>
          <ResponsiveTooltip delayDuration={300} message={fullIncomeTitle}>
            <p className="truncate text-base">{fullIncomeTitle}</p>
          </ResponsiveTooltip>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 truncate">
          {format(additionalIncome.createdAt, "HH:mm")}
        </ItemDescription>
      </ItemContent>

      <ItemContent>
        <ItemDescription className="font-semibold text-base text-indigo-600">
          {formatCurrency(additionalIncome.amount)}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Delete Additional Income Dialog */}
        <ResponsiveTooltip delayDuration={0} message="Видалити надходження">
          <AlertDialogDestructive
            applyButtonName="Видалити надходження"
            description="Ця дія є безповоротною. Це призведе до остаточного видалення даних про надходження."
            onDelete={handleDelete}
            title={`Ви впевнені, що хочете видалити надходження: ${fullIncomeTitle} ${formatCurrency(additionalIncome.amount)}?`}
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
        </ResponsiveTooltip>
      </ItemActions>
    </Item>
  );
}
