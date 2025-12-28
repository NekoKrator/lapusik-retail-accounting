import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import type { Dispatch, SetStateAction } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { TableFilter } from "@/types/filter-types";

type TableState = {
  sorting: SortingState;
  filters: TableFilter[];
};

const DEFAULT_STATE: TableState = {
  sorting: [],
  filters: [],
};

export function useTableState(storageKey: string) {
  const [state, setState] = useLocalStorage<TableState>(
    storageKey,
    DEFAULT_STATE
  );

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    setState((prev) => ({
      ...prev,
      sorting: typeof updater === "function" ? updater(prev.sorting) : updater,
    }));
  };

  const onFilterChange: Dispatch<SetStateAction<TableFilter[]>> = (updater) => {
    setState((prev) => ({
      ...prev,
      filters: typeof updater === "function" ? updater(prev.filters) : updater,
    }));
  };

  return {
    sorting: state.sorting,
    filters: state.filters,
    onSortingChange,
    onFilterChange,
  };
}
