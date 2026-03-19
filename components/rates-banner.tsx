"use client"

import type { Rates } from "@/lib/rates"

interface RatesBannerProps {
  rates: Rates
}

function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString("en-US", { maximumFractionDigits: 0 })
  if (rate >= 1) return rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return rate.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

function timeAgo(unix: number): string {
  const diff = Math.floor(Date.now() / 1000) - unix
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function RatesBanner({ rates }: RatesBannerProps) {
  const entries = Object.entries(rates).filter(
    ([, entry]) => entry.rate != null
  )

  if (entries.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Belo Rates
      </span>
      {entries.map(([currency, entry]) => (
        <div key={currency} className="flex items-center gap-2">
          <span className="font-mono text-sm text-foreground">
            1 USDT = {formatRate(entry.rate!)} {currency}
          </span>
          {entry.time && (
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(entry.time)}
            </span>
          )}
        </div>
      ))}
      <a
        href="https://criptoya.com"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        via CriptoYa
      </a>
    </div>
  )
}
