import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { CalendarSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FILTER_OPERATORS,
  type FilterConfig,
  type FilterOperator,
} from "@/types/filter-types";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Kbd } from "../ui/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type FilterInputProps = {
  config: FilterConfig;
  operator: FilterOperator;
  value: string;
  onOperatorChange: (operator: FilterOperator) => void;
  onValueChange: (value: string) => void;
};

export function FilterInput({
  config,
  operator,
  value,
  onOperatorChange,
  onValueChange,
}: FilterInputProps) {
  return (
    <div className="flex items-center gap-2">
      {(config.type === "number" ||
        config.type === "text" ||
        config.type === "date") && (
        <Select
          onValueChange={(v) =>
            onOperatorChange(
              FILTER_OPERATORS.find((op) => op.value === v) ??
                FILTER_OPERATORS[0]
            )
          }
          value={operator.value}
        >
          <SelectTrigger className="min-w-16 max-w-1/3">
            <SelectValue>{operator ? operator.sign : "Оберіть..."}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPERATORS.filter(
              (op) =>
                config.operators === undefined ||
                config.operators.includes(op.value)
            ).map((op) => (
              <SelectItem
                itemIndicator={
                  <Kbd className="min-w-7 bg-neutral-200 dark:bg-neutral-700/30">
                    {op.sign}
                  </Kbd>
                }
                key={op.label}
                value={op.value}
              >
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {(config.type === "boolean" || config.type === "enum") && (
        <Select onValueChange={onValueChange} value={value}>
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="Значення" />
          </SelectTrigger>
          <SelectContent>
            {config.type === "boolean" && (
              <>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </>
            )}

            {config.type === "enum" &&
              config.options?.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )}

      {config.type === "number" && (
        <Input
          className="w-48"
          onChange={(e) => onValueChange(e.target.value)}
          type="number"
          value={value}
        />
      )}

      {config.type === "text" && (
        <Input
          className="w-48"
          onChange={(e) => onValueChange(e.target.value)}
          type="text"
          value={value}
        />
      )}

      {config.type === "date" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-48 justify-start text-left" variant="outline">
              <CalendarSearch />
              {value ? format(new Date(value), "yyyy-MM-dd") : "Оберіть дату"}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              captionLayout="dropdown"
              formatters={{
                formatMonthDropdown: (month) =>
                  format(month, "LLLL", { locale: uk }),
              }}
              locale={uk}
              mode="single"
              onSelect={(date) => {
                if (!date) {
                  return;
                }
                onValueChange(format(date, "yyyy-MM-dd"));
              }}
              selected={value ? new Date(value) : undefined}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
