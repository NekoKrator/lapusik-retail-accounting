export const SupplierDeliveryFilterSchema = [
  "invoiceNumber",
  "price",
  "paidByCashier",
  "paidByOwner",
  "status",
  "createdAt",
  "updatedAt",

  // connected
  "displayUsername",
  "supplierName",

  // computed
  "debt",
];
