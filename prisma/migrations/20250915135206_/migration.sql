/*
  Warnings:

  - You are about to drop the column `amount` on the `SupplierPayment` table. All the data in the column will be lost.
  - Added the required column `debt` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SupplierPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierPayment" DROP COLUMN "amount",
ADD COLUMN     "debt" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paidOff" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SupplierPayment" ADD CONSTRAINT "SupplierPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
