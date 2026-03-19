"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TOKEN_SYMBOLS, TOKENS } from "@/lib/constants"
import type { Rates } from "@/lib/rates"
import { KpiCards } from "@/components/kpi-cards"
import { SupplyChart } from "@/components/supply-chart"
import { HoldersChart } from "@/components/holders-chart"
import { ActivityChart } from "@/components/activity-chart"
import { TopHolders } from "@/components/top-holders"
import { RatesBanner } from "@/components/rates-banner"

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
  rates: Rates
}

export function Dashboard({
  snapshot,
  supply,
  holders,
  activity,
  topHolders,
  rates,
}: DashboardProps) {
  const [selectedToken, setSelectedToken] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Tabs
        value={selectedToken ?? "all"}
        onValueChange={(v) => setSelectedToken(v === "all" ? null : v)}
      >
        <TabsList>
          <TabsTrigger value="all" className="text-sm tracking-wide">
            All Tokens
          </TabsTrigger>
          {TOKEN_SYMBOLS.map((sym) => (
            <TabsTrigger key={sym} value={sym} className="text-2xl leading-none" title={`${sym} — ${TOKENS[sym].name}`}>
              {TOKENS[sym].flag}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <RatesBanner rates={rates} />

      <KpiCards data={snapshot} selectedToken={selectedToken} rates={rates} />

      <div className="grid gap-4 md:grid-cols-2">
        <SupplyChart data={supply} selectedToken={selectedToken} rates={rates} />
        <HoldersChart data={holders} selectedToken={selectedToken} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ActivityChart
          data={activity}
          selectedToken={selectedToken}
          metric="num_transfers"
          rates={rates}
        />
        <ActivityChart
          data={activity}
          selectedToken={selectedToken}
          metric="transfer_volume"
          rates={rates}
        />
      </div>

      <TopHolders data={topHolders} selectedToken={selectedToken} rates={rates} />
    </div>
  )
}
