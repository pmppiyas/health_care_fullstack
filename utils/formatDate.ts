export function formatDate(date?: Date | string) {
  if (!date) return "—"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}
