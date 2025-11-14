/*
  Warnings:

  - You are about to drop the `CashReportBreakdown` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyCashReport` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CashReportBreakdown" DROP CONSTRAINT "CashReportBreakdown_reportId_fkey";

-- DropForeignKey
ALTER TABLE "DailyCashReport" DROP CONSTRAINT "DailyCashReport_userId_fkey";

-- DropTable
DROP TABLE "CashReportBreakdown";

-- DropTable
DROP TABLE "DailyCashReport";

-- CreateTable
CREATE TABLE "ExpensesReportBreakdown" (
    "id" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "terminalExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salaries" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utilities" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "supplierPayments" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "goodsWriteOff" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerWithdrawal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "piggyBank" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "ExpensesReportBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "openingBalance" DOUBLE PRECISION NOT NULL,
    "additionalBalance" DOUBLE PRECISION,
    "totalCashRegister" DOUBLE PRECISION,
    "expensesBalance" DOUBLE PRECISION,
    "calculatedClosingBalance" DOUBLE PRECISION,
    "actualClosingBalance" DOUBLE PRECISION,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpensesReportBreakdown_shiftId_key" ON "ExpensesReportBreakdown"("shiftId");

-- AddForeignKey
ALTER TABLE "ExpensesReportBreakdown" ADD CONSTRAINT "ExpensesReportBreakdown_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
