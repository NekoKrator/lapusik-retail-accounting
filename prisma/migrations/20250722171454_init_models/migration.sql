/*
  Warnings:

  - You are about to drop the column `storeId` on the `DailyCashReport` table. All the data in the column will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyCashReport" DROP CONSTRAINT "DailyCashReport_storeId_fkey";

-- AlterTable
ALTER TABLE "DailyCashReport" DROP COLUMN "storeId";

-- DropTable
DROP TABLE "Store";
