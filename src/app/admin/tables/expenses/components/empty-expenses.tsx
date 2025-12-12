import { TrendingDown } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyExpenses() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TrendingDown className="text-red-600" />
        </EmptyMedia>
        <EmptyTitle>Витрат не знайдено</EmptyTitle>
        <EmptyDescription>Наразі у вас немає витрат.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
