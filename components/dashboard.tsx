"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TOKEN_SYMBOLS, TOKENS } from "@/lib/constants"
import { KpiCards } from "@/components/kpi-cards"
import { SupplyChart } from "@/components/supply-chart"
import { HoldersChart } from "@/components/holders-chart"
import { ActivityChart } from "@/components/activity-chart"
import { TopHolders } from "@/components/top-holders"

interface DashboardProps {
  snapshot: Array<{
    symbol: string
    total_supply: number
    active_holders: number
    total_transfers: number
    total_volume: number
  }>
  supply: Array<{
    block_date: string
    symbol: string
    cumulative_supply: number
  }>
  holders: Array<{
    block_date: string
    symbol: string
    cumulative_holders: number
  }>
  activity: Array<{
    block_date: string
    symbol: string
    num_transfers: number
    transfer_volume: number
    unique_senders: number
    unique_receivers: number
  }>
  topHolders: Array<{
    symbol: string
    holder: string
    balance: number
    rank: number
  }>
}

export function Dashboard({
  snapshot,
  supply,
  holders,
  activity,
  topHolders,
}: DashboardProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Tabs
        value={selectedToken ?? "all"}
        onValueChange={(v) => setSelectedToken(v === "all" ? null : v)}
      >
        <TabsList>
          <TabsTrigger value="all" className="text-xs tracking-wide">
            All Tokens
          </TabsTrigger>
          {TOKEN_SYMBOLS.map((sym) => (
            <TabsTrigger key={sym} value={sym} className="text-xs tracking-wide">
              <span className="mr-1">{TOKENS[sym].flag}</span>
              {sym}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <KpiCards data={snapshot} selectedToken={selectedToken} />

      <div className="grid gap-4 md:grid-cols-2">
        <SupplyChart data={supply} selectedToken={selectedToken} />
        <HoldersChart data={holders} selectedToken={selectedToken} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityChart
          data={activity}
          selectedToken={selectedToken}
          metric="num_transfers"
        />
        <ActivityChart
          data={activity}
          selectedToken={selectedToken}
          metric="transfer_volume"
        />
      </div>

      <TopHolders data={topHolders} selectedToken={selectedToken} />
    </div>
  )
}
