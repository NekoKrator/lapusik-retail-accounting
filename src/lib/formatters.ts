export function formatCurrency(
  amount: number | bigint | Intl.StringNumericLiteral
): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    currencyDisplay: "narrowSymbol",
  }).format(amount);
}

export function durationFromSeconds(amount: number) {
  const hours = Math.floor(amount / 3600);
  const minutes = Math.floor((amount % 3600) / 60);

  return {
    hours,
    minutes,
  };
}
