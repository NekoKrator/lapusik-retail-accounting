import { Truck } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function SupplierDeliveriesEmpty() {
  return (
    <Empty className="h-[calc(130.6px*2+8px*4+92px)] md:h-[calc(80px*4+8px*4+92px)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Truck className="text-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Поставок не знайдено</EmptyTitle>
        <EmptyDescription>
          Цей розділ показує ваші поточні борги за отримані поставки. Щоб почати
          відстежувати поставки, створіть перший запис.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
