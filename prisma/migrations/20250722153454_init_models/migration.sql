/*
  Warnings:

  - You are about to drop the column `cardPayments` on the `CashReportBreakdown` table. All the data in the column will be lost.
  - You are about to drop the column `cashSetAside` on the `CashReportBreakdown` table. All the data in the column will be lost.
  - You are about to drop the column `paymentsToSuppliers` on the `CashReportBreakdown` table. All the data in the column will be lost.
  - You are about to drop the column `actualTotal` on the `DailyCashReport` table. All the data in the column will be lost.
  - You are about to drop the column `cashExpenses` on the `DailyCashReport` table. All the data in the column will be lost.
  - You are about to drop the column `cashIncome` on the `DailyCashReport` table. All the data in the column will be lost.
  - You are about to drop the column `eveningBalance` on the `DailyCashReport` table. All the data in the column will be lost.
  - You are about to drop the column `reportedTotal` on the `DailyCashReport` table. All the data in the column will be lost.
  - Added the required column `calculatedEveningBalance` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAvailable` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCashRegister` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalExpenses` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CashReportBreakdown" DROP COLUMN "cardPayments",
DROP COLUMN "cashSetAside",
DROP COLUMN "paymentsToSuppliers",
ADD COLUMN     "otherExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "piggyBank" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "supplierPayments" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "terminalExpenses" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "rent" SET DEFAULT 0,
ALTER COLUMN "salaries" SET DEFAULT 0,
ALTER COLUMN "utilities" SET DEFAULT 0,
ALTER COLUMN "ownerWithdrawal" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "DailyCashReport" DROP COLUMN "actualTotal",
DROP COLUMN "cashExpenses",
DROP COLUMN "cashIncome",
DROP COLUMN "eveningBalance",
DROP COLUMN "reportedTotal",
ADD COLUMN     "actualEveningBalance" DOUBLE PRECISION,
ADD COLUMN     "calculatedEveningBalance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difference" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalAvailable" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalCashRegister" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalExpenses" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
