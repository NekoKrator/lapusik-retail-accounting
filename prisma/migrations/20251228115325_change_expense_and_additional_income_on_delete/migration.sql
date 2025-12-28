-- DropForeignKey
ALTER TABLE "additional_income" DROP CONSTRAINT "additional_income_debtorId_fkey";

-- DropForeignKey
ALTER TABLE "expense" DROP CONSTRAINT "expense_debtorId_fkey";

-- DropForeignKey
ALTER TABLE "expense" DROP CONSTRAINT "expense_supplierDeliveryId_fkey";

-- AddForeignKey
ALTER TABLE "additional_income" ADD CONSTRAINT "additional_income_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_supplierDeliveryId_fkey" FOREIGN KEY ("supplierDeliveryId") REFERENCES "supplier_delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
