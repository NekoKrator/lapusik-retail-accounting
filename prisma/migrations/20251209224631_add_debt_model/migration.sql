/*
  Warnings:

  - You are about to drop the column `debt` on the `debtor` table. All the data in the column will be lost.
  - You are about to drop the column `isPaidOff` on the `debtor` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `debtor` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `supplier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DebtStatus" AS ENUM ('ACTIVE', 'PAID', 'CANCELED');

-- AlterTable
ALTER TABLE "debtor" DROP COLUMN "debt",
DROP COLUMN "isPaidOff",
DROP COLUMN "paid";

-- AlterTable
ALTER TABLE "supplier" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "debt" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "DebtStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "debtorId" TEXT NOT NULL,

    CONSTRAINT "debt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "debt" ADD CONSTRAINT "debt_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "debtor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
