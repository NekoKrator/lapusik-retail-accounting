import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
import { DialogDescriptionInfoRow } from "@/components/dialog-description-info-row";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { useDeleteAdditionalIncome } from "@/hooks/api/additional-income/use-delete-additional-income";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";

type AdditionalIncomeItemProps = {
  additionalIncome: AdditionalIncomeListItem;
};

export default function AdditionalIncomeItem({
  additionalIncome,
}: AdditionalIncomeItemProps) {
  const { mutateAsync: deleteAdditionalIncome } = useDeleteAdditionalIncome();

  const handleDelete = async () => {
    await deleteAdditionalIncome(additionalIncome.id);
    toast.success("Надходження успішно видалено!");
  };

  const { category, amount, createdAt, debtor } = additionalIncome;
  const formattedCreatedAt = format(createdAt, "HH:mm");
  const formattedAmount = formatCurrency(amount);
  const debtorName = debtor?.name;

  return (
    <Item className="h-20" variant="outline">
      <ItemContent className="overflow-hidden">
        {/* Category */}
        <ItemTitle className="text-base">
          <p className="truncate" title={category}>
            {category}
          </p>
        </ItemTitle>

        {/* Time and Source */}
        <ItemDescription className="flex gap-2 truncate opacity-70">
          <span className="truncate">{formattedCreatedAt}</span>
          {debtorName && (
            <Badge
              className="max-w-48 justify-start text-muted-foreground"
              title={debtorName}
              variant="outline"
            >
              <span className="truncate">{debtorName}</span>
            </Badge>
          )}
        </ItemDescription>
      </ItemContent>

      {/* Amount */}
      <ItemContent>
        <ItemDescription className="font-semibold text-base text-indigo-600">
          {formattedAmount}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Delete Additional Income Dialog */}
        <AlertDialogDestructive
          applyButtonName="Видалити надходження"
          description={
            <div className="flex flex-col gap-4">
              <AdditionalIncomeDialogDescription
                amount={formattedAmount}
                category={category}
                debtorName={debtorName}
              />
              <div className="flex flex-col">
                <p>
                  Дані про надходження будуть{" "}
                  <span className="font-bold">безповоротно</span> видалені.
                </p>
              </div>
            </div>
          }
          onDelete={handleDelete}
          title="Ви впевнені, що хочете видалити надходження?"
          tooltipMessage="Видалити надходження"
        />
      </ItemActions>
    </Item>
  );
}

const AdditionalIncomeDialogDescription = ({
  category,
  amount,
  debtorName,
}: {
  category: string;
  amount: string;
  debtorName?: string;
}) => (
  <div className="flex flex-col text-muted-foreground text-sm">
    <DialogDescriptionInfoRow label="Джерело" value={category} />
    <DialogDescriptionInfoRow label="Сума" value={amount} />
    {debtorName && (
      <DialogDescriptionInfoRow label="Боржник" value={debtorName} />
    )}
  </div>
);
