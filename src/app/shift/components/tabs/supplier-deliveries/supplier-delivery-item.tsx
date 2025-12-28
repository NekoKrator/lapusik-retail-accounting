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
import { useShiftContext } from "@/context/shift-context";
import { useUpdateSupplierDelivery } from "@/hooks/api/supplier-deliveries/use-update-supplier-delivery";
import { useWriteOffSupplierDelivery } from "@/hooks/api/supplier-deliveries/use-write-off-supplier-delivery";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierDeliveryListItem } from "@/modules/supplier-delivery/contracts";
import type { SupplierDeliveryWriteOffInput } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import { WriteOffSupplierDeliveryForm } from "./write-off-supplier-delivery-form";

type DeliveryItemProps = {
  delivery: SupplierDeliveryListItem;
};

export default function SupplierDeliveryItem({ delivery }: DeliveryItemProps) {
  const { currentShift } = useShiftContext();

  const {
    mutateAsync: writeOffSupplierDelivery,
    isPending: isPendingWriteOff,
  } = useWriteOffSupplierDelivery({ shiftId: currentShift.id });

  const { mutateAsync: updateSupplierDelivery, isPending: isPendingUpdate } =
    useUpdateSupplierDelivery();

  const handleWriteOff = async (payload: SupplierDeliveryWriteOffInput) => {
    await writeOffSupplierDelivery({
      id: delivery.id,
      payload,
    });
    const description = payload.paidByCashier
      ? `Створено витрату на ${payload.paidByCashier} ₴.`
      : undefined;
    toast.success("Поставку успішно списано!", {
      description,
    });
  };

  const handleRemove = async (id: string) => {
    await updateSupplierDelivery({
      id,
      payload: { status: "CANCELED" },
    });
    toast.success("Поставку успішно анульовано!");
  };

  const {
    invoiceNumber,
    supplier,
    price,
    paidByCashier,
    paidByOwner,
    createdAt,
  } = delivery;
  const { name } = supplier;
  const currentDebt = price - paidByCashier - paidByOwner;
  const formattedCurrentDebt = formatCurrency(currentDebt);
  const formattedLastDeliveryCreatedAt = format(createdAt, "dd MMMM, HH:mm", {
    locale: uk,
  });

  return (
    <Item className="h-20" variant="outline">
      <ItemContent className="overflow-hidden">
        {/* Name and Invoice Number */}
        <ItemTitle className="text-base">
          <p className="truncate" title={name}>
            {name}
          </p>
          <p
            className="truncate border-l pl-2 text-muted-foreground/70"
            title={invoiceNumber}
          >
            {invoiceNumber}
          </p>
        </ItemTitle>

        {/* Time */}
        <ItemDescription className="truncate opacity-70">
          {formattedLastDeliveryCreatedAt}
        </ItemDescription>
      </ItemContent>

      {/* Current Debt */}
      <ItemContent className="w-32 flex-none text-right">
        <ItemDescription className="font-semibold text-base text-blue-600">
          {formattedCurrentDebt}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="hidden sm:flex">
        {/* Write Off Delivery */}
        <Dialog
          description={
            <SupplierDeliveryDialogDescription
              currentDebt={formattedCurrentDebt}
              invoiceNumber={invoiceNumber}
              supplierName={name}
            />
          }
          title={
            <div className="flex items-center gap-2">
              <BanknoteArrowDown className="text-blue-600" /> Погасити борг
            </div>
          }
          tooltipMessage="Погасити борг"
          trigger={
            <Button
              className="h-9 w-9 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
              disabled={isPendingUpdate}
              type="button"
              variant="ghost"
            >
              <BanknoteArrowDown />
            </Button>
          }
        >
          <WriteOffSupplierDeliveryForm
            currentDebt={currentDebt}
            onWriteOff={handleWriteOff}
          />
        </Dialog>

        {/* Remove  Delivery */}
        <AlertDialogDestructive
          applyButtonName="Анулювати борг"
          description={
            <div className="flex flex-col gap-4">
              <SupplierDeliveryDialogDescription
                currentDebt={formattedCurrentDebt}
                invoiceNumber={invoiceNumber}
                supplierName={name}
              />
              <div className="flex flex-col">
                <p>
                  Дані про пов'язані витрати{" "}
                  <span className="font-bold">залишаться</span>.
                </p>
              </div>
            </div>
          }
          onDelete={() => handleRemove(delivery.id)}
          title="Ви впевнені, що хочете анулювати борг поставки?"
          tooltipMessage="Анулювати борг"
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

const SupplierDeliveryDialogDescription = ({
  supplierName,
  invoiceNumber,
  currentDebt,
}: {
  supplierName: string;
  invoiceNumber?: string;
  currentDebt: string;
}) => (
  <div className="flex flex-col text-muted-foreground text-sm">
    <DialogDescriptionInfoRow label="Постачальник" value={supplierName} />
    <DialogDescriptionInfoRow
      label="Номер накладної"
      value={invoiceNumber ?? "-"}
    />
    <DialogDescriptionInfoRow label="Борг" value={currentDebt} />
  </div>
);
