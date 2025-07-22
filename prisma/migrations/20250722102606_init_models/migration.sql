-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyCashReport" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "morningBalance" DOUBLE PRECISION NOT NULL,
    "cashIncome" DOUBLE PRECISION NOT NULL,
    "cashExpenses" DOUBLE PRECISION NOT NULL,
    "reportedTotal" DOUBLE PRECISION NOT NULL,
    "actualTotal" DOUBLE PRECISION NOT NULL,
    "eveningBalance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyCashReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashReportBreakdown" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "cardPayments" DOUBLE PRECISION NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "salaries" DOUBLE PRECISION NOT NULL,
    "utilities" DOUBLE PRECISION NOT NULL,
    "paymentsToSuppliers" DOUBLE PRECISION NOT NULL,
    "ownerWithdrawal" DOUBLE PRECISION NOT NULL,
    "cashSetAside" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CashReportBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashReportBreakdown_reportId_key" ON "CashReportBreakdown"("reportId");

-- AddForeignKey
ALTER TABLE "DailyCashReport" ADD CONSTRAINT "DailyCashReport_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyCashReport" ADD CONSTRAINT "DailyCashReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashReportBreakdown" ADD CONSTRAINT "CashReportBreakdown_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "DailyCashReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
