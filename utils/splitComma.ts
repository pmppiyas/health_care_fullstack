export function splitComma(str: string) {
  return str
    ? str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
}
