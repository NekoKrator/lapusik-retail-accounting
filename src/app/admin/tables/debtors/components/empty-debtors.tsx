import { Users } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyDebtors() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users className="text-orange-600" />
        </EmptyMedia>
        <EmptyTitle>Боржників не знайдено</EmptyTitle>
        <EmptyDescription>Наразі у вас немає боржників.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
