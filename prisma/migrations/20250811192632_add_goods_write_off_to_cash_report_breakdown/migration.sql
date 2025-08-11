/*
  Warnings:

  - You are about to drop the column `inventoryWriteOff` on the `CashReportBreakdown` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CashReportBreakdown" DROP COLUMN "inventoryWriteOff",
ADD COLUMN     "goodsWriteOff" DOUBLE PRECISION NOT NULL DEFAULT 0;
