/*
  Warnings:

  - You are about to drop the column `debt` on the `Debtor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debtor" DROP COLUMN "debt",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 0;
