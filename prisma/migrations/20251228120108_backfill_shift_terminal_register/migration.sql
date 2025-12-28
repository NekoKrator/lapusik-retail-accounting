-- Update
UPDATE "shift" s
SET "terminalRegister" = sub."total_amount"
FROM (
  SELECT "shiftId", SUM(amount) AS "total_amount"
  FROM expense
  WHERE category = 'TERMINAL'
  GROUP BY "shiftId"
) sub
WHERE sub."shiftId" = s.id;