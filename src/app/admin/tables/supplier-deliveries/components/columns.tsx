"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CircleAlert } from "lucide-react";
import { ColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { DebtStatus } from "@/generated/prisma/enums";
import { debtStatusBadge } from "@/lib/constants/debt-status-badge";
import { formatCurrency } from "@/lib/formatters";
import type { SupplierDeliveryStats } from "@/schemas/supplier-delivery/supplier-delivery-schema";

const calculateTotal = (
  data: SupplierDeliveryStats[],
  accessor: keyof SupplierDeliveryStats
) => data.reduce((acc, row) => acc + Number(row[accessor]), 0);

const getStatusBadge = (status: DebtStatus) => {
  const badge = debtStatusBadge.find((c) => c.key === status);
  return (
    badge || {
      key: status,
      label: status,
      icon: CircleAlert,
      colorClass: "text-red-600",
    }
  );
};

export const columns: ColumnDef<SupplierDeliveryStats>[] = [
  {
    id: "select",
    maxSize: 32,
    header: ({ table }) => (
      <Checkbox
        aria-label="Обрати все"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Обрати строку"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "displayUsername",
    meta: {
      label: "Відділ",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Відділ" />,
    cell: ({ row }) => {
      const displayUsername = row.original.displayUsername;
      return <div className="truncate">{displayUsername}</div>;
    },
  },
  {
    accessorKey: "supplierName",
    meta: {
      label: "Постачальник",
      isGrow: true,
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Постачальник" />
    ),
    cell: ({ row }) => {
      const content = row.getValue("supplierName") as string;

      return (
        <div className="truncate" title={content}>
          {row.getValue("supplierName")}
        </div>
      );
    },
  },
  {
    accessorKey: "invoiceNumber",
    meta: {
      label: "Номер накладної",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Номер накладної" />
    ),
    cell: ({ row }) => {
      const invoiceNumber = row.getValue("invoiceNumber") as string;

      return (
        <div className="truncate" title={invoiceNumber}>
          {invoiceNumber}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    meta: {
      label: "Статус",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Статус" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as DebtStatus;
      const badge = getStatusBadge(status);

      return (
        <Badge className="text-muted-foreground" variant="outline">
          <badge.icon className={badge.colorClass} />
          {badge.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "price",
    meta: {
      label: "Ціна",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Ціна" />,
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("price"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "price");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "debt",
    meta: {
      label: "Борг",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Борг" />,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("debt"));

      return (
        <div className={"truncate text-end"}>{formatCurrency(amount)}</div>
      );
    },
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "debt");
      return (
        <div className={"truncate text-end font-bold"}>
          {formatCurrency(total)}
        </div>
      );
    },
  },

  {
    accessorKey: "paidByCashier",
    meta: {
      label: "Сплачено касиром",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Сплачено касиром" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("paidByCashier"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidByCashier");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "paidByOwner",
    meta: {
      label: "Сплачено власником",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Сплачено власником" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("paidByOwner"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "paidByOwner");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    meta: {
      label: "Час створення",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Час створення" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {format(row.getValue("createdAt"), "dd.MM.yy, HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    meta: {
      label: "Час оновлення",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Час оновлення" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {format(row.getValue("updatedAt"), "dd.MM.yy, HH:mm")}
      </div>
    ),
  },
  {
    id: "__spacer",
    size: 24,
    enableResizing: false,
  },
];
