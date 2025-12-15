import { Users } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function DebtorsEmpty() {
  return (
    <Empty className="h-[calc(130.6px*2+8px*4+92px)] md:h-[calc(80px*4+8px*4+92px)]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users className="text-orange-600" />
        </EmptyMedia>
        <EmptyTitle>Немає записів про боржників</EmptyTitle>
        <EmptyDescription>
          У цьому розділі фіксується інформація про осіб, які заборгували кошти.
          Щоб почати відстежувати боржників, створіть перший запис.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
