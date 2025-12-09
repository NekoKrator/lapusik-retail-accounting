import { TrendingDown } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ExpenseEmpty() {
  return (
    <Empty className="h-[calc(130.6px*2+8px*4+92px)] md:h-[calc(80px*4+8px*4+92px)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrendingDown className="text-red-600" />
        </EmptyMedia>
        <EmptyTitle>Немає записів про витрати</EmptyTitle>
        <EmptyDescription>
          Тут будуть відображатися всі операційні витрати: оренда, комунальні
          послуги, зарплати тощо. Щоб почати відстежувати ці витрати, створіть
          перший запис.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
