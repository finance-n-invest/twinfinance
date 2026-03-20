"use client"

import { useState, useEffect } from "react"
import { TOKEN_SYMBOLS, TOKENS } from "@/lib/constants"
import type { Rates } from "@/lib/rates"

interface RatesBannerProps {
  rates: Rates
}

const POLL_INTERVAL = 10 * 60 * 1000 // 10 minutes

function formatRate(rate: number): string {
  if (rate >= 1000) return rate.toLocaleString("en-US", { maximumFractionDigits: 0 })
  if (rate >= 1) return rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return rate.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

export function RatesBanner({ rates: initialRates }: RatesBannerProps) {
  const [rates, setRates] = useState<Rates>(initialRates)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/rates")
        if (res.ok) setRates(await res.json())
      } catch {
        // keep current rates on error
      }
    }

    const interval = setInterval(poll, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-border px-3 py-1.5 text-xs md:text-sm">
      <span className="font-medium text-muted-foreground tracking-wide">
        Rates
      </span>
      <span className="font-mono text-foreground">
        1 USDT
        {TOKEN_SYMBOLS.map((sym) => {
          const currency = TOKENS[sym].currency
          const entry = rates[currency]
          const hasRate = entry?.rate != null
          return (
            <span key={sym}>
              {" = "}
              <span className={hasRate ? "text-foreground" : "text-muted-foreground"}>
                {hasRate ? formatRate(entry.rate!) : "—"} {sym}
              </span>
            </span>
          )
        })}
      </span>
    </div>
  )
}
