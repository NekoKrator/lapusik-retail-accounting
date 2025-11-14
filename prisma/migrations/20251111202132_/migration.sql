/*
  Warnings:

  - You are about to drop the column `amount` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Debtor` table. All the data in the column will be lost.
  - You are about to drop the `SupplierPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SupplierPayment" DROP CONSTRAINT "SupplierPayment_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierPayment" DROP CONSTRAINT "SupplierPayment_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierPayment" DROP CONSTRAINT "SupplierPayment_userId_fkey";

-- AlterTable
ALTER TABLE "Debtor" DROP COLUMN "amount",
DROP COLUMN "date",
ADD COLUMN     "currentDebt" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalDebt" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "SupplierPayment";
