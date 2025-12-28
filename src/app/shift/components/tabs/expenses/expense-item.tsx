"use client";

import { format } from "date-fns";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
import { DialogDescriptionInfoRow } from "@/components/dialog-description-info-row";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useDeleteExpense } from "@/hooks/api/expense/use-delete-expense";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { formatCurrency } from "@/lib/formatters";
import type { ExpenseListItem } from "@/modules/expense/contracts";

type ExpenseItemProps = {
  expense: ExpenseListItem;
};

const getCategoryIcon = (category: string) => {
  const cat = expenseCategories.find((c) => c.key === category);
  const IconComponent = cat?.icon || AlertCircle;
  return <IconComponent className="h-4 w-4" />;
};

const getCategoryLabel = (category: string) => {
  const cat = expenseCategories.find((c) => c.key === category);
  return cat?.label || "Інше";
};

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const { mutateAsync: deleteExpense } = useDeleteExpense();

  const handleDelete = async () => {
    await deleteExpense(expense.id);
    toast.success("Витрату успішно видалено!");
  };

  const { category, amount, createdAt, debtor, supplierDelivery } = expense;
  const categoryLabel = getCategoryLabel(expense.category);
  const formattedCreatedAt = format(createdAt, "HH:mm");
  const debtorName = debtor?.name;
  const supplierName = supplierDelivery?.supplier.name;
  const secondaryName = debtorName || supplierName;
  const formattedAmount = formatCurrency(amount);

  return (
    <Item className="h-20" variant="outline">
      {/* Icon */}
      <ItemMedia
        className="hidden text-red-600 group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-auto sm:flex"
        variant="icon"
      >
        {getCategoryIcon(category)}
      </ItemMedia>

      <ItemContent className="overflow-hidden">
        {/* Category */}
        <ItemTitle className="text-base">
          <p className="truncate" title={categoryLabel}>
            {categoryLabel}
          </p>
        </ItemTitle>

        {/* Time and Source */}
        <ItemDescription className="flex gap-2 truncate opacity-70">
          <span className="truncate">{formattedCreatedAt}</span>
          {secondaryName && (
            <Badge
              className="max-w-48 justify-start text-muted-foreground"
              title={secondaryName}
              variant="outline"
            >
              <span className="truncate">{secondaryName}</span>
            </Badge>
          )}
        </ItemDescription>
      </ItemContent>

      {/* Amount */}
      <ItemContent>
        <ItemDescription className="font-semibold text-base text-red-600">
          {formattedAmount}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Delete Expense Dialog */}
        <AlertDialogDestructive
          applyButtonName="Видалити витрату"
          description={
            <div className="flex flex-col gap-4">
              <ExpenseDialogDescription
                amount={formattedAmount}
                category={categoryLabel}
                debtorName={debtorName}
                supplierName={supplierName}
              />
              <div className="flex flex-col">
                <p>
                  Дані про витрату будуть{" "}
                  <span className="font-bold">безповоротно</span> видалені.
                </p>
              </div>
            </div>
          }
          onDelete={handleDelete}
          title="Ви впевнені, що хочете видалити витрату?"
          tooltipMessage="Видалити витрату"
        />
      </ItemActions>
    </Item>
  );
}

const ExpenseDialogDescription = ({
  category,
  amount,
  debtorName,
  supplierName,
}: {
  category: string;
  amount: string;
  debtorName?: string;
  supplierName?: string;
}) => (
  <div className="flex flex-col text-muted-foreground text-sm">
    <DialogDescriptionInfoRow label="Категорія" value={category} />
    <DialogDescriptionInfoRow label="Сума" value={amount} />
    {debtorName && (
      <DialogDescriptionInfoRow label="Боржник" value={debtorName} />
    )}
    {supplierName && (
      <DialogDescriptionInfoRow label="Постачальник" value={supplierName} />
    )}
  </div>
);
