export function formatCurrency(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) {
    return "Pending";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Pending";
  }

  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return "No refresh yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatMetric(value: number | null | undefined, digits = 3) {
  if (value == null || Number.isNaN(value)) {
    return "Pending";
  }

  return value.toFixed(digits);
}

export function formatPercent(value: number | null | undefined, digits = 1) {
  if (value == null || Number.isNaN(value)) {
    return "Pending";
  }

  return `${(value * 100).toFixed(digits)}%`;
}

export function formatSignedPercent(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) {
    return "Pending";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

export function formatHorizon(value: string | null | undefined) {
  if (value === "1w") {
    return "1W";
  }
  if (value === "1m") {
    return "1M";
  }
  if (value === "3m") {
    return "3M";
  }
  if (value === "1y") {
    return "1Y";
  }
  if (value === "all") {
    return "ALL";
  }

  return "Pending";
}

export function formatPredictionRange(
  lower: number | null | undefined,
  upper: number | null | undefined,
  intervalLevel?: number | null,
) {
  if (lower == null || upper == null || Number.isNaN(lower) || Number.isNaN(upper)) {
    return "Pending";
  }

  const confidence = intervalLevel == null ? "Range" : `${Math.round(intervalLevel * 100)}% range`;
  return `${confidence} ${formatCurrency(lower)} - ${formatCurrency(upper)}`;
}
