"use client";

import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import type { DeleteManyInput } from "@/schemas/common/delete-many-schema";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { getPluralRows } from "./data-table";

type DeleteDialogProps<TData> = {
  table: Table<TData>;
  selectedRowCount: number;
  onDelete: (payload: DeleteManyInput) => Promise<{ count: number }>;

  description?: React.ReactNode;
};

export function DeleteDialog<TData>({
  table,
  selectedRowCount,
  onDelete,
  description,
}: DeleteDialogProps<TData>) {
  const [isLoading, setIsLoading] = useState(false);

  const selectedRowIds = table.getSelectedRowModel().rows.map((row) => row.id);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await onDelete?.({ ids: selectedRowIds });
      if (result) {
        table.toggleAllPageRowsSelected(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Видалити {selectedRowCount} {getPluralRows(selectedRowCount)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-16">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ви впевнені, що хочете видалити обрані рядки?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? (
              <>
                Обрані рядки будуть{" "}
                <span className="font-bold">безповоротно</span> видалені.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Скасувати</AlertDialogCancel>

          <Button
            className="relative has-[>svg]:px-4"
            disabled={isLoading}
            onClick={handleDelete}
            variant="destructive"
          >
            <p className={isLoading ? "invisible" : "visible"}>
              Видалити рядки
            </p>
            {isLoading && (
              <Spinner className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
