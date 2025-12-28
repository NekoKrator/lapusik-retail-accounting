-- Update
UPDATE "supplier_delivery"
SET "status" = CASE
  WHEN "isPaidOff" = false THEN 'ACTIVE'
  WHEN "isPaidOff" = true
       AND ("price" - "paidByCashier" - "paidByOwner") <= 0 THEN 'PAID'
  WHEN "isPaidOff" = true
       AND ("price" - "paidByCashier" - "paidByOwner") > 0 THEN 'CANCELED'
END::"DebtStatus";