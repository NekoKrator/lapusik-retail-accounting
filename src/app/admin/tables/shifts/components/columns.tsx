"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDuration } from "date-fns";
import { uk } from "date-fns/locale";
import { CircleCheck, CircleDot } from "lucide-react";
import { ColumnHeader } from "@/components/data-table/column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { durationFromSeconds, formatCurrency } from "@/lib/formatters";
import type { ShiftStats } from "@/schemas/shift/shift-schema";

const calculateTotal = (data: ShiftStats[], accessor: keyof ShiftStats) =>
  data.reduce((acc, row) => acc + Number(row[accessor]), 0);

const getShiftSeconds = (
  row: {
    isClosed: boolean;
    shiftDuration: number;
    openedAt: string | Date;
  },
  now: number
): number => {
  if (row.isClosed) {
    return row.shiftDuration;
  }

  const openedAtMs = new Date(row.openedAt).getTime();

  return (now - openedAtMs) / 1000;
};

const formatSeconds = (seconds: number): string => {
  const formatted = formatDuration(durationFromSeconds(seconds), {
    locale: uk,
  });

  return formatted === "" ? "< 1 хвилини" : formatted;
};

const getIsClosedBadge = (isClosed: boolean) =>
  isClosed
    ? {
        key: "closed",
        label: "Закрита",
        icon: CircleCheck,
        colorClass: "text-background fill-green-500 dark:fill-green-400",
      }
    : {
        key: "opened",
        label: "Відкрита",
        icon: CircleDot,
        colorClass: "text-background fill-blue-600 dark:fill-blue-500",
      };

export const columns: ColumnDef<ShiftStats>[] = [
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
    accessorKey: "isClosed",
    meta: {
      label: "Статус",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Статус" />,
    cell: ({ row }) => {
      const isClosed = row.getValue("isClosed") as boolean;
      const badge = getIsClosedBadge(isClosed);

      return (
        <Badge variant="outline">
          <badge.icon className={badge.colorClass} />
          {badge.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "openedAt",
    meta: {
      label: "Час початку",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Час початку" />
    ),
    cell: ({ row }) => {
      const item = row.getValue("openedAt") as Date;

      return (
        <div className="truncate text-end">
          {format(item, "dd.MM.yy, HH:mm")}
        </div>
      );
    },
  },
  {
    accessorKey: "openingBalance",
    meta: {
      label: "Ранковий залишок",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Ранковий залишок" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("openingBalance"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "openingBalance");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAdditionalIncome",
    meta: {
      label: "Додаткові надходження",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Додаткові надходження" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalAdditionalIncome"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalAdditionalIncome");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalCashRegister",
    meta: {
      label: "Виторг",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Виторг" />,
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalCashRegister"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalCashRegister");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "terminalRegister",
    meta: {
      label: "Термінал",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Термінал" />,
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("terminalRegister"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "terminalRegister");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "expectedClosingBalance",
    meta: {
      label: "Розрахунковий залишок",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Розрахунковий залишок" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("expectedClosingBalance"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(
        table.options.data,
        "expectedClosingBalance"
      );
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "totalExpenses",
    meta: {
      label: "Витрати",
    },
    header: ({ column }) => <ColumnHeader column={column} title="Витрати" />,
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("totalExpenses"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "totalExpenses");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "actualClosingBalance",
    meta: {
      label: "Фактичний залишок",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Фактичний залишок" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {formatCurrency(row.getValue("actualClosingBalance"))}
      </div>
    ),
    footer: ({ table }) => {
      const total = calculateTotal(table.options.data, "actualClosingBalance");
      return (
        <div className="truncate text-end font-bold">
          {formatCurrency(total)}
        </div>
      );
    },
  },
  {
    accessorKey: "shiftDuration",
    meta: { label: "Час зміни" },
    header: ({ column }) => <ColumnHeader column={column} title="Час зміни" />,
    cell: ({ row }) => {
      const now = Date.now();
      const seconds = getShiftSeconds(row.original, now);

      return <div className="truncate text-end">{formatSeconds(seconds)}</div>;
    },
    footer: ({ table }) => {
      const now = Date.now();

      const totalSeconds = table.options.data.reduce(
        (sum, row) => sum + getShiftSeconds(row, now),
        0
      );

      return (
        <div className="truncate text-end font-bold">
          {formatSeconds(totalSeconds)}
        </div>
      );
    },
  },
  {
    accessorKey: "closedAt",
    meta: {
      label: "Час закриття",
    },
    header: ({ column }) => (
      <ColumnHeader column={column} title="Час закриття" />
    ),
    cell: ({ row }) => {
      const closedAt = row.getValue("closedAt") as Date;
      return (
        <div className="truncate text-end">
          {closedAt ? format(closedAt, "dd.MM.yy, HH:mm") : "-"}
        </div>
      );
    },
  },
  {
    id: "__spacer",
    size: 24,
    enableResizing: false,
  },
];
