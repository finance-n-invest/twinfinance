"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOKENS, TOKEN_SYMBOLS } from "@/lib/constants"
import { formatNumber } from "@/lib/format"

interface ActivityRow {
  block_date: string
  symbol: string
  num_transfers: number
  transfer_volume: number
  unique_senders: number
  unique_receivers: number
}

interface ActivityChartProps {
  data: ActivityRow[]
  selectedToken: string | null
  metric: "num_transfers" | "transfer_volume"
}

export function ActivityChart({
  data,
  selectedToken,
  metric,
}: ActivityChartProps) {
  const tokens = selectedToken ? [selectedToken] : TOKEN_SYMBOLS
  const title =
    metric === "num_transfers" ? "Daily Transfers" : "Daily Transfer Volume"

  const dateMap = new Map<string, Record<string, number>>()
  for (const row of data) {
    if (selectedToken && row.symbol !== selectedToken) continue
    const existing = dateMap.get(row.block_date) ?? {}
    existing[row.symbol] = row[metric]
    dateMap.set(row.block_date, existing)
  }

  const sortedDates = Array.from(dateMap.keys()).sort()
  const chartData = sortedDates.map((date) => {
    const entry = dateMap.get(date)!
    for (const sym of tokens) {
      if (entry[sym] === undefined) entry[sym] = 0
    }
    return { date, ...entry }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-base font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke="#666666"
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke="#666666"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#121212",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#e5e5e5",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
              formatter={(value) => formatNumber(Number(value))}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {tokens.map((sym) => (
              <Bar
                key={sym}
                dataKey={sym}
                stackId="a"
                fill={TOKENS[sym as keyof typeof TOKENS].color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
