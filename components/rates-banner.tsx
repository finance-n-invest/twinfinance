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
  const allCurrencies = ["ARS", "BRL", "COP", "MXN", "PEN"]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border px-3 py-1.5 text-[11px]">
      <span className="font-medium text-muted-foreground uppercase tracking-wide">
        Rates
      </span>
      {allCurrencies.map((currency) => {
        const entry = rates[currency]
        const hasRate = entry?.rate != null
        return (
          <span key={currency} className={`font-mono ${hasRate ? "text-foreground" : "text-muted-foreground"}`}>
            {hasRate ? formatRate(entry.rate!) : "—"} {currency}
          </span>
        )
      })}
      <a
        href="https://criptoya.com"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
      >
        via CriptoYa
      </a>
    </div>
  )
}
