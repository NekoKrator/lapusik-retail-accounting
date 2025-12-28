// components/supplier-picker.tsx

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSuppliers } from "@/hooks/api/supplier/use-suppliers";
import { cn } from "@/lib/utils";

type SupplierValue =
  | {
      connect: {
        id: string;
      };
    }
  | undefined;

type SupplierPickerProps = {
  value: SupplierValue;
  onChange: (value: { connect: { id: string } } | undefined) => void;
  onBlur: () => void;
  disabled?: boolean;
};

export default function SupplierPicker({
  value,
  onChange,
  onBlur,
  disabled,
}: SupplierPickerProps) {
  const [open, setOpen] = useState(false);

  const { data: suppliers } = useSuppliers();

  const selectedSupplierId = value?.connect?.id;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="justify-between font-normal"
          disabled={disabled}
          onBlur={onBlur}
          role="combobox"
          variant="outline"
        >
          {selectedSupplierId ? (
            <p className="truncate">
              {suppliers?.find((s) => s.id === selectedSupplierId)?.name}
            </p>
          ) : (
            <p className="truncate text-muted-foreground">
              Оберіть постачальника...
            </p>
          )}

          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput className="h-9" placeholder="Пошук постачальника..." />
          <CommandList>
            <CommandEmpty>Постачальників не знайдено.</CommandEmpty>
            <CommandGroup>
              {suppliers?.map((s) => (
                <CommandItem
                  key={s.id}
                  onSelect={(currentValue) => {
                    const selectedObject = suppliers.find(
                      (supplier) => supplier.name === currentValue
                    );

                    const selectedId = selectedObject
                      ? selectedObject.id
                      : undefined;

                    const newValue: SupplierValue = selectedId
                      ? {
                          connect: { id: selectedId },
                        }
                      : undefined;

                    const isAlreadySelected = selectedSupplierId === selectedId;

                    onChange(isAlreadySelected ? undefined : newValue);

                    setOpen(false);
                  }}
                  value={s.name}
                >
                  <p className="truncate" title={s.name}>
                    {s.name}
                  </p>
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedSupplierId === s.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
