/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `debtor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "debtor_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "debtor_userId_name_key" ON "debtor"("userId", "name");
