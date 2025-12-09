export function formatCurrency(
  amount: number | bigint | Intl.StringNumericLiteral
): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}
