import { Truck } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptySuppliers() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Truck className="text-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Постачальників не знайдено</EmptyTitle>
        <EmptyDescription>Наразі у вас немає постачальників.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
