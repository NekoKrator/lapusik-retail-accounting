/*
  Warnings:

  - You are about to drop the column `debt` on the `Debtor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CashReportBreakdown" ADD COLUMN "inventoryWriteOff" FLOAT DEFAULT 0 NOT NULL;
