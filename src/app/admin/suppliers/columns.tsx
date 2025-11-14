"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/formatters";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

export type SupplierStats = {
    supplierId: string;
    supplierName: string;
    operationsCount: number;
    paidByCashier: number;
    paidByOwner: number;
    totalPaid: number;
    currentDebt: number;
};

export const columns: ColumnDef<SupplierStats>[] = [
    {
        accessorKey: "supplierName",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Постачальник" />
        ),
        cell: ({ row }) => (
            <div className="truncate font-semibold">
                {row.getValue("supplierName")}
            </div>
        ),
        meta: {
            label: "Постачальник",
        },
    },
    {
        accessorKey: "operationsCount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Операцій" />
        ),
        cell: ({ row }) => (
            <div className="truncate">{row.getValue("operationsCount")}</div>
        ),
        meta: {
            label: "Операцій",
        },
    },
    {
        accessorKey: "paidByCashier",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Касир" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("paidByCashier"));
            const formatted = formatCurrency(amount);
            return <div className="truncate">{formatted}</div>;
        },
        meta: {
            label: "Касир",
        },
    },
    {
        accessorKey: "paidByOwner",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Власник" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("paidByOwner"));
            const formatted = formatCurrency(amount);
            return <div className="truncate">{formatted}</div>;
        },
        meta: {
            label: "Власник",
        },
    },
    {
        accessorKey: "totalPaid",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Усього" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalPaid"));
            const formatted = formatCurrency(amount);
            return <div className="truncate">{formatted}</div>;
        },
        meta: {
            label: "Усього",
        },
    },
    {
        accessorKey: "currentDebt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Борг" />
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("currentDebt"));
            const formatted = formatCurrency(amount);
            return (
                <div
                    className={`truncate ${
                        amount > 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {formatted}
                </div>
            );
        },
        meta: {
            label: "Борг",
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const s = row.original;
            const onDelete = table.options.meta?.onDelete;
            const isDeleting = table.options.meta?.isDeleting;

            return (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={isDeleting?.(s.supplierId)}
                            className="text-gray-400 hover:text-destructive hover:bg-red-50"
                        >
                            {isDeleting?.(s.supplierId) ? (
                                <Spinner />
                            ) : (
                                <Trash2 />
                            )}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Ви впевнені, що хочете видалити цього
                                постачальника?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Цю дію не можна скасувати. Це призведе до
                                остаточного видалення данів про постачальника та
                                всіх пов&apos;язаних операцій.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Скасувати</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => onDelete?.(s.supplierId)}
                                className="bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                            >
                                Видалити постачальника
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            );
        },
        enableHiding: false,
    },
];
