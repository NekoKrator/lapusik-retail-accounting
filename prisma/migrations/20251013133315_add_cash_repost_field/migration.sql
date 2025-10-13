/*
  Warnings:

  - Added the required column `additionalBalance` to the `DailyCashReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyCashReport" ADD COLUMN     "additionalBalance" DOUBLE PRECISION NOT NULL;
