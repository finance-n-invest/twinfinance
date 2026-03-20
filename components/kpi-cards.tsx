"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users, ArrowRightLeft, TrendingUp } from "lucide-react"
import { formatNumber, formatWithCurrency, formatUsd } from "@/lib/format"
import { TOKENS, TOKEN_SYMBOLS } from "@/lib/constants"
import type { Rates } from "@/lib/rates"
import { toUsd } from "@/lib/rates"

interface SnapshotRow {
  symbol: string
  total_supply: number
  active_holders: number
  total_transfers: number
  total_volume: number
}

interface KpiCardsProps {
  data: SnapshotRow[]
  selectedToken: string | null
  rates: Rates
}

function getCurrency(symbol: string): string {
  return TOKENS[symbol as keyof typeof TOKENS]?.currency ?? ""
}

/** Use the token symbol as the display label (e.g. "ARGt" not "ARS") */
function getLabel(symbol: string): string {
  return symbol
}

export function KpiCards({ data, selectedToken, rates }: KpiCardsProps) {
  const visibleSymbols = TOKEN_SYMBOLS as readonly string[]
  const filtered = selectedToken
    ? data.filter((r) => r.symbol === selectedToken)
    : data.filter((r) => visibleSymbols.includes(r.symbol))

  const totalHolders = filtered.reduce((s, r) => s + r.active_holders, 0)
  const totalTransfers = filtered.reduce((s, r) => s + r.total_transfers, 0)

  // For supply and volume, we need currency context
  let supplyDisplay: string
  let supplySubtext: string | null = null
  let volumeDisplay: string
  let volumeSubtext: string | null = null

  if (selectedToken) {
    // Single token: show local currency + USD if available
    const currency = getCurrency(selectedToken)
    const supply = filtered.reduce((s, r) => s + r.total_supply, 0)
    const volume = filtered.reduce((s, r) => s + r.total_volume, 0)

    supplyDisplay = formatWithCurrency(supply, getLabel(selectedToken))
    const supplyUsd = toUsd(supply, currency, rates)
    if (supplyUsd != null) supplySubtext = `~ ${formatUsd(supplyUsd)}`

    volumeDisplay = formatWithCurrency(volume, getLabel(selectedToken))
    const volumeUsd = toUsd(volume, currency, rates)
    if (volumeUsd != null) volumeSubtext = `~ ${formatUsd(volumeUsd)}`
  } else {
    // All tokens: try to sum in USD where possible, list rest separately
    let usdSupplyTotal = 0
    let usdVolumeTotal = 0
    let hasAnyUsd = false
    const noRateSymbols: string[] = []

    for (const row of filtered) {
      const currency = getCurrency(row.symbol)
      const supplyUsd = toUsd(row.total_supply, currency, rates)
      const volumeUsd = toUsd(row.total_volume, currency, rates)
      if (supplyUsd != null) {
        usdSupplyTotal += supplyUsd
        usdVolumeTotal += (volumeUsd ?? 0)
        hasAnyUsd = true
      } else {
        noRateSymbols.push(row.symbol)
      }
    }

    if (hasAnyUsd) {
      supplyDisplay = formatUsd(usdSupplyTotal)
      volumeDisplay = formatUsd(usdVolumeTotal)
      if (noRateSymbols.length > 0) {
        supplySubtext = `excl. ${noRateSymbols.join(", ")}`
        volumeSubtext = `excl. ${noRateSymbols.join(", ")}`
      }
    } else {
      // No rates at all — just show raw sum
      const supply = filtered.reduce((s, r) => s + r.total_supply, 0)
      const volume = filtered.reduce((s, r) => s + r.total_volume, 0)
      supplyDisplay = formatNumber(supply)
      volumeDisplay = formatNumber(volume)
    }
  }

  const cards = [
    {
      title: "Total Supply",
      value: supplyDisplay,
      subtext: supplySubtext,
      icon: Coins,
    },
    {
      title: "Total Holders",
      value: formatNumber(totalHolders),
      subtext: null,
      icon: Users,
    },
    {
      title: "Total Transfers",
      value: formatNumber(totalTransfers),
      subtext: null,
      icon: ArrowRightLeft,
    },
    {
      title: "Transfer Volume",
      value: volumeDisplay,
      subtext: volumeSubtext,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-[#ff6602]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-semibold tracking-tight">
              {card.value}
            </div>
            {card.subtext && (
              <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
