"use client";

import { format } from "date-fns";
import { AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialogDestructive } from "@/components/alert-dialog-destructive";
import { ResponsiveTooltip } from "@/components/responsive-tooltip";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { useShiftContext } from "@/context/shift-context";
import { useDeleteExpense } from "@/hooks/api/expense/use-delete-expense";
import { expenseCategories } from "@/lib/constants/expense-categories";
import { formatCurrency } from "@/lib/formatters";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

type ExpenseItemProps = {
  expense: ExpenseWithInclude;
};

export default function ExpenseItem({ expense }: ExpenseItemProps) {
  const { currentShift } = useShiftContext();

  const { mutateAsync: deleteExpense } = useDeleteExpense({
    shiftId: currentShift.id,
  });

  console.log(expense.id);

  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find((c) => c.key === category);
    const IconComponent = cat?.icon || AlertCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const cat = expenseCategories.find((c) => c.key === category);
    return cat?.label || "Інше";
  };

  const debtorName = expense?.debtor?.name != null ? expense.debtor.name : "";
  const supplierName =
    expense?.supplierDelivery?.supplier?.name != null
      ? expense.supplierDelivery.supplier?.name
      : "";

  const categoryLabel = getCategoryLabel(expense.category);
  const secondaryName = debtorName || supplierName;

  const fullExpenseTitle = secondaryName
    ? `${categoryLabel} (${secondaryName})`
    : categoryLabel;

  const handleDelete = async () => {
    await deleteExpense(expense.id);
    toast.success("Витрату успішно видалено!");
  };

  return (
    <Item className="h-20" variant="outline">
      <ItemMedia
        className="hidden text-red-600 group-has-data-[slot=item-description]/item:translate-y-0 group-has-data-[slot=item-description]/item:self-auto sm:flex"
        variant="icon"
      >
        {getCategoryIcon(expense.category)}
      </ItemMedia>

      <ItemContent className="overflow-hidden">
        <ItemTitle>
          <ResponsiveTooltip delayDuration={300} message={fullExpenseTitle}>
            <p className="truncate text-base">{fullExpenseTitle}</p>
          </ResponsiveTooltip>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 truncate">
          {format(expense.createdAt, "HH:mm")}
        </ItemDescription>
      </ItemContent>

      <ItemContent>
        <ItemDescription className="font-semibold text-base text-red-600">
          {formatCurrency(expense.amount)}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Delete Additional Income Dialog */}
        <ResponsiveTooltip delayDuration={0} message="Видалити витрату">
          <AlertDialogDestructive
            applyButtonName="Видалити витрату"
            description="Ця дія є безповоротною. Це призведе до остаточного видалення даних про витрату."
            onDelete={handleDelete}
            title={`Ви впевнені, що хочете видалити витрату: ${fullExpenseTitle} ${formatCurrency(expense.amount)}?`}
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
