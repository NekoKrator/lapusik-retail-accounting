-- AlterTable
ALTER TABLE "supplier_delivery" ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "status" "DebtStatus" NOT NULL DEFAULT 'ACTIVE';
