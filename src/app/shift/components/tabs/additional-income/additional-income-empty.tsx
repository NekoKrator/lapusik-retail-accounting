import { BanknoteArrowUp } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AdditionalIncomeEmpty() {
  return (
    <Empty className="h-[calc(130.6px*2+8px*4+92px)] md:h-[calc(80px*4+8px*4+92px)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteArrowUp className="text-indigo-600" />
        </EmptyMedia>
        <EmptyTitle>Немає записів про додаткові надходження</EmptyTitle>
        <EmptyDescription>
          Додаткові надходження — це кошти, отримані поза основною торгівельною
          діяльністю. Щоб почати відстежувати ці доходи, створіть перший запис.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
