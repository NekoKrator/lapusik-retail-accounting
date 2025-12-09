"use client";

import type React from "react";
import { createContext, type ReactNode, useContext } from "react";
import type { Shift } from "@/generated/prisma/client";

type ShiftContextType = {
  currentShift: Shift;
  lastClosedShift: Shift | null;
};

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export const useShiftContext = (): ShiftContextType => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error(
      "useShiftContext повинен використовуватися всередині ShiftProvider"
    );
  }
  return context;
};

type ShiftProviderProps = {
  children: ReactNode;
  currentShift: Shift;
  lastClosedShift: Shift | null;
};

export const ShiftProvider: React.FC<ShiftProviderProps> = ({
  children,
  currentShift,
  lastClosedShift,
}) => {
  const value = {
    currentShift,
    lastClosedShift,
  };

  return (
    <ShiftContext.Provider value={value}>{children}</ShiftContext.Provider>
  );
};
