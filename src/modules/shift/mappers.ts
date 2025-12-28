import type {
  ShiftCurrent,
  ShiftCurrentResult,
  ShiftLastClosed,
} from "./contracts";
import type { ShiftCurrentDb, ShiftLastClosedDb } from "./db-types";

export function toCurrentShiftResult({
  currentShift,
  lastClosedShift,
}: {
  currentShift: ShiftCurrentDb | null;
  lastClosedShift: ShiftLastClosedDb | null;
}): ShiftCurrentResult {
  return {
    currentShift: currentShift
      ? {
          id: currentShift.id,
          openingBalance: currentShift.openingBalance,
          openedAt: currentShift.openedAt,
        }
      : null,

    lastClosedShift: lastClosedShift
      ? {
          id: lastClosedShift.id,
          actualClosingBalance: lastClosedShift.actualClosingBalance,
          closedAt: lastClosedShift.closedAt,
        }
      : null,
  };
}

export function toOpenResult(db: ShiftCurrentDb): ShiftCurrent {
  return {
    id: db.id,
    openingBalance: db.openingBalance,
    openedAt: db.openedAt,
  };
}

export function toCloseResult(db: ShiftLastClosedDb): ShiftLastClosed {
  return {
    id: db.id,
    actualClosingBalance: db.actualClosingBalance,
    closedAt: db.closedAt,
  };
}
