const getCurrencyFormatter = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: Number.isInteger(Number(value)) ? 0 : 2,
    maximumFractionDigits: 2,
  });

export const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return getCurrencyFormatter(0).format(0);
  }

  return getCurrencyFormatter(numericValue).format(numericValue);
};

export const formatPercentage = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0%";
  }

  const safeValue = Math.max(0, numericValue);
  const roundedValue = safeValue.toFixed(safeValue % 1 === 0 ? 0 : 1);

  return `${roundedValue.replace(/\.0$/, "")}%`;
};

export const getSafeProgress = (amount, limit) => {
  const numericAmount = Number(amount);
  const numericLimit = Number(limit);

  if (
    !Number.isFinite(numericAmount) ||
    !Number.isFinite(numericLimit) ||
    numericLimit <= 0
  ) {
    return null;
  }

  return Math.max(0, (numericAmount / numericLimit) * 100);
};

export const formatDateTime = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} • ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
};

export const formatCount = (count, singular = "item", plural = "items") => {
  const safeCount = Number(count) || 0;
  return `${safeCount} ${safeCount === 1 ? singular : plural}`;
};
