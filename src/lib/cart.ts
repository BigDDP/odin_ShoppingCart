export const clampCount = (value: number, max: number) =>
  Math.min(Math.max(Number.isNaN(value) ? 0 : value, 0), max);

export const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;
