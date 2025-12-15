import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
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
  const { mutateAsync: deleteSupplier, isPending: isDeletePending } =
    useDeleteSupplier();

  return (
    <>
      <ResponsiveDialog
        description={<span>Назва: {s.name}</span>}
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

      <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="overflow-hidden">
            <AlertDialogTitle>
              <p
                className="line-clamp-3 overflow-hidden text-ellipsis"
                title="Ви впевнені, що хочете видалити цього постачальника?"
              >
                Ви впевнені, що хочете видалити цього постачальника?
              </p>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія є безповоротною. Це призведе до остаточного видалення даних
              про постачальника та всіх пов'язаних операцій.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Скасувати
            </AlertDialogCancel>

            <Button
              className="relative has-[>svg]:px-4"
              disabled={isDeletePending}
              onClick={() => deleteSupplier(s.id)}
              variant="destructive"
            >
              <span className={isDeletePending ? "invisible" : "visible"}>
                Видалити постачальника
              </span>
              {isDeletePending && (
                <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-5 rounded-sm" size="icon-sm" variant="ghost">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <DropdownMenuItem onSelect={() => setIsEditOpen(true)}>
            Редагувати
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setIsDeleteOpen(true)}
            variant="destructive"
          >
            Видалити
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
