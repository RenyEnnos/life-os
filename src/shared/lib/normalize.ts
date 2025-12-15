export function normalizeEmail(email: string): string {
  return (email ?? "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
}

export function normalizeName(name: string): string {
  return (name ?? "")
    .normalize("NFKC")
    .trim()
}
