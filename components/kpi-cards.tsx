"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Users, ArrowRightLeft, TrendingUp } from "lucide-react"
import { formatNumber } from "@/lib/format"

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
}

export function KpiCards({ data, selectedToken }: KpiCardsProps) {
  const filtered = selectedToken
    ? data.filter((r) => r.symbol === selectedToken)
    : data

  const totalSupply = filtered.reduce((s, r) => s + r.total_supply, 0)
  const totalHolders = filtered.reduce((s, r) => s + r.active_holders, 0)
  const totalTransfers = filtered.reduce((s, r) => s + r.total_transfers, 0)
  const totalVolume = filtered.reduce((s, r) => s + r.total_volume, 0)

  const cards = [
    {
      title: "Total Supply",
      value: formatNumber(totalSupply),
      icon: Coins,
    },
    {
      title: "Active Holders",
      value: formatNumber(totalHolders),
      icon: Users,
    },
    {
      title: "Total Transfers",
      value: formatNumber(totalTransfers),
      icon: ArrowRightLeft,
    },
    {
      title: "Transfer Volume",
      value: formatNumber(totalVolume),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
