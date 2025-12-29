"use client";

import { useLocalStorage } from "usehooks-ts";
import type { TableKey } from "@/context/tables-context";
import { useMounted } from "@/hooks/use-mounted";

const STORAGE_KEY = "tables-state";

type TablesStorageState = {
  currentTable: TableKey;
  tables: Record<string, unknown>;
};

const DEFAULT_STATE: TablesStorageState = {
  currentTable: "shifts",
  tables: {},
};

export function useCurrentTable() {
  const mounted = useMounted();

  const [state, setState] = useLocalStorage<TablesStorageState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  const setCurrentTable = (table: TableKey) => {
    setState((prev) => ({ ...prev, currentTable: table }));
  };

  return {
    mounted,
    currentTable: state.currentTable,
    setCurrentTable,
  };
}
