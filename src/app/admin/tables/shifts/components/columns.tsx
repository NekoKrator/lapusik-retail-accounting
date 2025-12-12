"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { uk } from "date-fns/locale";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { Shift } from "@/generated/prisma/client";
import { formatCurrency } from "@/lib/formatters";

// import { ActionsCell } from "./actions-cell";

const calculateTotal = (data: Shift[], accessor: keyof Shift) =>
  data.reduce((acc, row) => acc + Number(row[accessor]), 0);

export const columns: ColumnDef<Shift>[] = [
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
    accessorKey: "isClosed",
    meta: {
      label: "Статус",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Статус" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {row.getValue("isClosed") ? "Закрита" : "Відкрита"}
      </div>
    ),
  },
  {
    accessorKey: "openedAt",
    meta: {
      label: "Час початку",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Час початку" />
    ),
    cell: ({ row }) => (
      <div className="truncate text-end">
        {format(row.getValue("openedAt"), "dd.MM.yy, HH:mm")}
      </div>
    ),
  },
  {
    accessorKey: "closedAt",
    meta: {
      label: "Час закриття",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Час закриття" />
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
    accessorKey: "workTime",
    meta: {
      label: "Час зміни",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Час зміни" />
    ),
    cell: ({ row }) => {
      const openedAt = new Date(row.getValue("openedAt"));
      const closedAt = row.getValue("closedAt") as Date;

      let endDuration = new Date();
      if (closedAt) {
        endDuration = new Date(closedAt);
      }

      const duration = intervalToDuration({
        start: openedAt,
        end: endDuration,
      });

      const workTimeDisplay = formatDuration(duration, {
        format: ["hours", "minutes"],
        locale: uk,
      });

      const finalDisplay =
        workTimeDisplay.trim() === "" ? "0 хвилин" : workTimeDisplay;

      return <div className="truncate text-end">{finalDisplay}</div>;
    },
  },
  {
    accessorKey: "totalCashRegister",
    meta: {
      label: "Виторг",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Виторг" />
    ),
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
    accessorKey: "totalAdditionalIncome",
    meta: {
      label: "Додаткові надходження",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Додаткові надходження" />
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
    accessorKey: "totalExpenses",
    meta: {
      label: "Витрати",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Витрати" />
    ),
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
    accessorKey: "expectedClosingBalance",
    meta: {
      label: "Розрахунковий залишок",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Розрахунковий залишок" />
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
    accessorKey: "actualClosingBalance",
    meta: {
      label: "Фактичний залишок",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Фактичний залишок" />
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
  // {
  // 	id: "actions",
  // 	enableHiding: false,
  // 	maxSize: 51,
  // 	cell: (props) => <ActionsCell row={props.row} table={props.table} />,
  // },
];
