export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 })
}

/** Format with currency code: "15.6B ARS", "500K BRL" */
export function formatWithCurrency(n: number, currency: string): string {
  return `${formatNumber(n)} ${currency}`
}

/** Format as USDT equivalent: "USDT 10.5M", "USDT 340K" */
export function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `USDT ${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `USDT ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `USDT ${(n / 1_000).toFixed(1)}K`
  if (n >= 1) return `USDT ${n.toFixed(0)}`
  return `USDT ${n.toFixed(2)}`
}

/** Format date string "2026-03-19" → "Mar 19" */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}
