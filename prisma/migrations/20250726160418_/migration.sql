/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Debtor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Debtor_name_userId_key" ON "Debtor"("name", "userId");
