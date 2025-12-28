import { Package } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptySupplierDelivery() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Package className="text-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Поставок не знайдено</EmptyTitle>
        <EmptyDescription>Наразі у вас немає поставок.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
