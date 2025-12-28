import { X } from "lucide-react";
import {
  type DraftFilterRow,
  FILTER_OPERATORS,
  type FilterConfig,
} from "@/types/filter-types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FilterInput } from "./filter-input";

type FilterRowProps = {
  row: DraftFilterRow;
  configs: FilterConfig[];
  onChange: (row: DraftFilterRow) => void;
  onRemove: () => void;
};

export function FilterRow({
  row,
  configs,
  onChange,
  onRemove,
}: FilterRowProps) {
  return (
    <div className="flex gap-2">
      <Button onClick={onRemove} size="icon" variant="outline">
        <X />
      </Button>

      <Select
        onValueChange={(v) => {
          const config = configs.find((c) => String(c.key) === v);
          if (!config) {
            return;
          }

          onChange({
            ...row,
            config,
            operator: FILTER_OPERATORS[0],
            value: "",
          });
        }}
        value={row.config ? String(row.config.key) : ""}
      >
        <SelectTrigger className="min-w-48 max-w-1/3">
          <SelectValue placeholder="Стовпець" />
        </SelectTrigger>
        <SelectContent>
          {configs.map((c) => (
            <SelectItem key={String(c.key)} value={String(c.key)}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {row.config && (
        <FilterInput
          config={row.config}
          onOperatorChange={(operator) => onChange({ ...row, operator })}
          onValueChange={(value) => onChange({ ...row, value })}
          operator={row.operator}
          value={row.value}
        />
      )}
    </div>
  );
}
