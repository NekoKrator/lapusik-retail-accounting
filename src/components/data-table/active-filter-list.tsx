import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TableFilter } from "@/types/filter-types";
import { ScrollArea } from "../ui/scroll-area";

type ActiveFiltersListProps = {
  filters: TableFilter[];
  onApply: () => void;
  onRemove: (key: string, value: string) => void;
  onClearAll?: () => void;
};

export function ActiveFiltersList({
  filters,
  onApply,
  onRemove,
  onClearAll,
}: ActiveFiltersListProps) {
  return (
    <div className="flex flex-col gap-2">
      {!filters.length && (
        <p className="text-center text-muted-foreground text-sm">
          Фільтрів не створено
        </p>
      )}

      <ScrollArea
        className="max-h-[calc(52px*3+8px*2)] [&>div>div[style]]:left-3!"
        type="always"
      >
        <div className="space-y-2">
          {filters.map((f) => (
            <div
              className="flex h-13 items-center justify-between rounded border p-2"
              key={`${f.key}-${f.value}`}
            >
              <span className="text-sm">
                {f.label} {f.operator.sign} {String(f.value)}
              </span>
              <Button
                onClick={() => onRemove(f.key, f.value)}
                size="icon"
                variant="ghost"
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex">
        {onClearAll && filters.length > 0 && (
          <Button onClick={onClearAll} variant="outline">
            Очистити все
          </Button>
        )}

        <Button className="ml-auto" onClick={onApply}>
          Застосувати
        </Button>
      </div>
    </div>
  );
}
