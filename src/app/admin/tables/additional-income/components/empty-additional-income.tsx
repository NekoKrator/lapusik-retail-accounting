import { BanknoteArrowUp } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyAdditionalIncome() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteArrowUp className="text-blue-600" />
        </EmptyMedia>
        <EmptyTitle>Додаткових надходжень не знайдено</EmptyTitle>
        <EmptyDescription>
          Наразі у вас немає додаткових надходжень.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
