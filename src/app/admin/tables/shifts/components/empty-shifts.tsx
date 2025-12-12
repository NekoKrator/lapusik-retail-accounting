import { Briefcase } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyShifts() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Briefcase className="text-purple-600" />
        </EmptyMedia>
        <EmptyTitle>Робочих змін не знайдено</EmptyTitle>
        <EmptyDescription>Наразі у вас немає робочих змін.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
