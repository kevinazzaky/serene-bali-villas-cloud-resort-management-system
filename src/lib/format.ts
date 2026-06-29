export const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
});

export const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

export function formatCurrency(value: unknown) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getFormString(
  formData: FormData,
  key: string,
  fallback = "",
) {
  const value = formData.get(key);
  return typeof value === "string" ? value : fallback;
}
