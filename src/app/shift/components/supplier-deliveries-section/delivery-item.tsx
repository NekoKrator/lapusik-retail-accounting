"use client";

import { format } from "date-fns";
import { BanknoteArrowDown, Trash2 } from "lucide-react";
import { useMemo } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { useShiftContext } from "@/context/shift-context";
import { useUpdateSupplierDelivery } from "@/hooks/api/supplier-deliveries/use-update-supplier-delivery";
import { useWriteOffSupplierDelivery } from "@/hooks/api/supplier-deliveries/use-write-off-supplier-delivery";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierDeliveryWithSupplier } from "@/schemas/supplier-delivery-schema";

type DeliveryItemProps = {
  delivery: SupplierDeliveryWithSupplier;
};

export default function DeliveryItem({ delivery }: DeliveryItemProps) {
  const { currentShift } = useShiftContext();

  const {
    mutateAsync: writeOffSupplierDelivery,
    isPending: isPendingWriteOff,
  } = useWriteOffSupplierDelivery(currentShift.id);

  const { mutateAsync: updateSupplierDelivery } = useUpdateSupplierDelivery();

  const currentDebt = useMemo(
    () =>
      delivery.price -
      Number(delivery.paidByCashier) -
      Number(delivery.paidByOwner),
    [delivery.price, delivery.paidByCashier, delivery.paidByOwner]
  );

  const handleWriteOff = async (id: string, debt: number) => {
    await writeOffSupplierDelivery({
      id,
      payload: { paidByCashier: debt },
    });
    toast.success("Поставку успішно списано!");
  };

  const handleRemove = async (id: string) => {
    await updateSupplierDelivery({
      id,
      payload: { paidByOwner: currentDebt, isPaidOff: true },
    });
    toast.success("Поставку успішно видалено!");
  };

  return (
    <Item className="h-20" variant="outline">
      {/* Name and Time */}
      <ItemContent className="overflow-hidden">
        <ItemTitle className="text-base">
          <ResponsiveTooltip
            delayDuration={300}
            message={delivery.supplier?.name}
          >
            <p className="truncate text-base">{delivery.supplier?.name}</p>
          </ResponsiveTooltip>
        </ItemTitle>
        <ItemDescription className="line-clamp-1 truncate">
          {format(delivery.updatedAt, "dd.MM.yy, HH:mm")}
        </ItemDescription>
      </ItemContent>

      {/* Current Debt */}
      <ItemContent>
        <ItemDescription className="font-semibold text-base text-blue-600">
          {formatCurrency(currentDebt)}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Write Off Delivery */}
        <ResponsiveTooltip delayDuration={0} message="Списати поставку">
          <Button
            className="h-9 w-9 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
            disabled={isPendingWriteOff}
            onClick={() => handleWriteOff(delivery.id, currentDebt)}
            type="button"
            variant="ghost"
          >
            {isPendingWriteOff ? (
              <Spinner />
            ) : (
              <BanknoteArrowDown className="h-4 w-4" />
            )}
          </Button>
        </ResponsiveTooltip>

        {/* Remove  Delivery */}
        <AlertDialogDestructive
          applyButtonName="Видалити поставку"
          description="Дані про поставку будуть безповоротно видалені. Відповідні дані про витрату залишаться."
          onDelete={() => handleRemove(delivery.id)}
          title={`Ви впевнені, що хочете видалити поставку: ${delivery.supplier?.name} ${formatCurrency(currentDebt)}?`}
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-red-50 hover:text-destructive"
              disabled={isPendingWriteOff}
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
