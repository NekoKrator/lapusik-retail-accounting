import { DialogTrigger } from "@radix-ui/react-dialog";
import type { Row } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateSupplier } from "@/hooks/api/supplier/use-update-supplier";
import type { SupplierStats } from "@/schemas/supplier/supplier-schema";
import { EditSupplierForm } from "./edit-supplier-form";

type ActionsCellProps = {
  row: Row<SupplierStats>;
};

export const ActionsCell = ({ row }: ActionsCellProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const s = row.original;

  const { mutateAsync: updateSupplier } = useUpdateSupplier();

  return (
    <Dialog onOpenChange={setIsEditOpen} open={isEditOpen}>
      <DialogTrigger asChild>
        <Button className="size-5 rounded-sm" size="sm" variant="ghost">
          <SquarePen />
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Редагувати постачальника</DialogTitle>
        </DialogHeader>
        <EditSupplierForm
          initialData={s}
          onUpdate={(payload) => updateSupplier({ id: s.id, payload })}
          setIsOpen={setIsEditOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
