export function toDateInputValue(d?: Date | string) {
  if (!d) return ""
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ""
  return dt.toISOString().slice(0, 10)
}
