"use client";

import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { TableKey } from "@/context/tables-context";
import type { TableFilter } from "@/types/filter-types";

export type TableState = {
  sorting: SortingState;
  filters: TableFilter[];
};

export type TablesStorageState = {
  currentTable: TableKey;
  tables: Partial<Record<TableKey, TableState>>;
};

const STORAGE_KEY = "tables-state";

const DEFAULT_TABLE_STATE: TableState = {
  sorting: [],
  filters: [],
};

const DEFAULT_STORAGE_STATE: TablesStorageState = {
  currentTable: "shifts",
  tables: {},
};

export function useTableState(tableKey: TableKey) {
  const [storage, setStorage] = useLocalStorage<TablesStorageState>(
    STORAGE_KEY,
    DEFAULT_STORAGE_STATE
  );

  const tableState = storage.tables[tableKey] ?? DEFAULT_TABLE_STATE;

  const updateTableState = (partial: Partial<TableState>) => {
    setStorage((prev) => ({
      ...prev,
      currentTable: tableKey,
      tables: {
        ...prev.tables,
        [tableKey]: {
          ...tableState,
          ...partial,
        },
      },
    }));
  };

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    updateTableState({
      sorting:
        typeof updater === "function" ? updater(tableState.sorting) : updater,
    });
  };

  const onFilterChange: Dispatch<SetStateAction<TableFilter[]>> = (updater) => {
    updateTableState({
      filters:
        typeof updater === "function" ? updater(tableState.filters) : updater,
    });
  };

  return {
    sorting: tableState.sorting,
    filters: tableState.filters,
    onSortingChange,
    onFilterChange,
  };
}
