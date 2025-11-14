/*
  Warnings:

  - You are about to drop the column `date` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `debt` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `paidOff` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `SupplierPayment` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `SupplierPayment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentSource" AS ENUM ('CASHIER', 'OWNER');

-- AlterTable
ALTER TABLE "SupplierPayment" DROP COLUMN "date",
DROP COLUMN "debt",
DROP COLUMN "paidOff",
DROP COLUMN "paymentType",
DROP COLUMN "totalPrice",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deliveryId" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "source" "PaymentSource" NOT NULL;

-- DropEnum
DROP TYPE "PaymentType";

-- CreateTable
CREATE TABLE "SupplierDelivery" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "paidByCashier" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidByOwner" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierDelivery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupplierDelivery" ADD CONSTRAINT "SupplierDelivery_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierDelivery" ADD CONSTRAINT "SupplierDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "SupplierDelivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
