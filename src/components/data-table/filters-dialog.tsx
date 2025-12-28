import { Filter, Funnel, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  type DraftFilterRow,
  FILTER_OPERATORS,
  type FilterConfig,
  type TableFilter,
} from "@/types/filter-types";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { FilterRow } from "./filter-row";

type FiltersDialogProps = {
  configs: FilterConfig[];
  filters: TableFilter[];
  onFiltersChange: (filters: TableFilter[]) => void;
};

export function FiltersDialog({
  configs,
  filters,
  onFiltersChange,
}: FiltersDialogProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<DraftFilterRow[]>([]);

  function handleAddRow() {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        config: configs[0],
        operator: FILTER_OPERATORS[0],
        value: "",
      },
    ]);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      return;
    }

    const nextRows = filters
      .map((f) => {
        const config = configs.find((c) => c.key === f.key);
        if (!config) {
          return null;
        }

        return {
          id: crypto.randomUUID(),
          config,
          operator: f.operator,
          value: f.value,
        };
      })
      .filter((row) => row !== null);

    setRows(
      nextRows.length > 0
        ? nextRows
        : [
            {
              id: crypto.randomUUID(),
              config: configs[0],
              operator: FILTER_OPERATORS[0],
              value: "",
            },
          ]
    );
  }

  function handleApply() {
    const applied = rows
      .filter((r) => r.config && r.value !== "")
      .map((r) => ({
        key: r.config.key,
        label: r.config.label,
        operator: r.operator,
        value: r.value,
      }));

    onFiltersChange(applied);
    setOpen(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button
          className="relative has-[>svg]:px-2 xl:has-[>svg]:px-2.5"
          size="sm"
          variant="outline"
        >
          <Funnel />
          <p className="hidden xl:inline">Фільтри ({filters.length})</p>
          {filters.length > 0 && (
            <div className="-top-2 -right-2 absolute flex size-4 items-center justify-center rounded-xl bg-accent-foreground text-accent text-sm">
              !
            </div>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter />
            Фільтри
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between gap-2">
          <ScrollArea className="h-[calc(52px*3+8px*2)] w-full" type="always">
            <div className="flex flex-col gap-2">
              {rows.map((row) => (
                <FilterRow
                  configs={configs}
                  key={row.id}
                  onChange={(next) =>
                    setRows((prev) =>
                      prev.map((r) => (r.id === row.id ? next : r))
                    )
                  }
                  onRemove={() =>
                    setRows((prev) => prev.filter((r) => r.id !== row.id))
                  }
                  row={row}
                />
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Separator orientation="vertical" />

            <div className="flex flex-col gap-2">
              <Button onClick={handleAddRow} variant="outline">
                <Plus /> Додати фільтр
              </Button>

              <Button
                className="px-1 text-foreground"
                onClick={() => setRows([])}
                variant="link"
              >
                Очистити фільтри
              </Button>

              <Button className="mt-auto" onClick={handleApply}>
                Застосувати
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
