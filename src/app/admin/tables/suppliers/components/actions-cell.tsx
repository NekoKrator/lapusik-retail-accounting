import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { ResponsiveAlertDialog } from "@/components/responsive-alert-dialog";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteSupplier } from "@/hooks/api/supplier/use-delete-supplier";
import { useUpdateSupplier } from "@/hooks/api/supplier/use-update-supplier";
import type { SupplierStats } from "@/schemas/supplier-schema";
import { EditSupplierForm } from "./edit-supplier-form";

type ActionsCellProps = {
  row: Row<SupplierStats>;
};

export const ActionsCell: React.FC<ActionsCellProps> = ({ row }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const s = row.original;

  const { mutateAsync: updateSupplier } = useUpdateSupplier();
  const { mutateAsync: deleteSupplier } = useDeleteSupplier();

  return (
    <>
      <ResponsiveDialog
        description={""}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Редагувати постачальника"
      >
        <EditSupplierForm
          initialData={s}
          onUpdate={(payload) => updateSupplier({ id: s.id, payload })}
          setIsOpen={setIsEditOpen}
        />
      </ResponsiveDialog>

      <ResponsiveAlertDialog
        applyButtonName="Видалити постачальника"
        applyButtonType="destructive"
        cancelButtonName="Скасувати"
        description="Ця дія є безповоротною. Це призведе до остаточного видалення даних про постачальника та всіх пов'язаних операцій."
        isOpen={isDeleteOpen}
        onApply={() => deleteSupplier(s.id)}
        setIsOpen={setIsDeleteOpen}
        title="Ви впевнені, що хочете видалити цього постачальника?"
      />

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-5 rounded-sm" size="icon-sm" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Дії</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            <SquarePen />
            Редагувати
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)}>
            <Trash2 />
            Видалити
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
