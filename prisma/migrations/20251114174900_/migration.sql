-- DropForeignKey
ALTER TABLE "SupplierDelivery" DROP CONSTRAINT "SupplierDelivery_supplierId_fkey";

-- AddForeignKey
ALTER TABLE "SupplierDelivery" ADD CONSTRAINT "SupplierDelivery_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
