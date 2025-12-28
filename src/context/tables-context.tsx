"use client";

import { createContext, useContext, useState } from "react";

export type TableKey =
  | "shifts"
  | "suppliers"
  | "supplier-deliveries"
  | "debtors"
  | "additional-income"
  | "expenses";

type TablesContextValue = {
  activeTable: TableKey | null;
  setActiveTable: (key: TableKey) => void;
};

const TablesContext = createContext<TablesContextValue | null>(null);

export function TablesProvider({ children }: { children: React.ReactNode }) {
  const [activeTable, setActiveTable] = useState<TableKey | null>(null);

  return (
    <TablesContext.Provider value={{ activeTable, setActiveTable }}>
      {children}
    </TablesContext.Provider>
  );
}

export function useTables() {
  const ctx = useContext(TablesContext);
  if (!ctx) {
    throw new Error("useTables must be used inside TablesProvider");
  }
  return ctx;
}
