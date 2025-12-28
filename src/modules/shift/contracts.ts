export type ShiftCurrent = {
  id: string;
  openingBalance: number;
  openedAt: Date;
};

export type ShiftLastClosed = {
  id: string;
  actualClosingBalance: number | null;
  closedAt: Date | null;
};

export type ShiftCurrentResult = {
  currentShift: ShiftCurrent | null;
  lastClosedShift: ShiftLastClosed | null;
};
