"use client";

import LoadingScreen from "@/components/loading-screen";
import { ShiftProvider } from "@/context/shift-context";
import { useShiftCurrent } from "../../hooks/api/shift/use-shift-current";
import OpenShift from "./components/open-shift";
import SalesPage from "./components/sales-page";

export default function ShiftPage() {
  const { isLoading, data: shift } = useShiftCurrent();

  if (isLoading) {
    return <LoadingScreen message="Перевірка активної зміни..." />;
  }

  if (shift !== undefined && shift.currentShift !== null) {
    return (
      <ShiftProvider
        currentShift={shift.currentShift}
        lastClosedShift={shift.lastClosedShift}
      >
        <SalesPage
          currentShift={shift.currentShift}
          lastClosedShift={shift.lastClosedShift}
        />
      </ShiftProvider>
    );
  }

  return (
    <OpenShift isLoading={isLoading} lastClosedShift={shift?.lastClosedShift} />
  );
}
