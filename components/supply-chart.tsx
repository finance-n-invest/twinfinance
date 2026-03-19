"use client"

import {
  AreaChart,
  Area,
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

interface SupplyRow {
  block_date: string
  symbol: string
  cumulative_supply: number
}

interface SupplyChartProps {
  data: SupplyRow[]
  selectedToken: string | null
}

export function SupplyChart({ data, selectedToken }: SupplyChartProps) {
  const tokens = selectedToken
    ? [selectedToken]
    : TOKEN_SYMBOLS

  // Pivot data: { date, ARGt, BRAt, COLt, PERt, MEXt }
  const dateMap = new Map<string, Record<string, number>>()
  for (const row of data) {
    if (selectedToken && row.symbol !== selectedToken) continue
    const existing = dateMap.get(row.block_date) ?? {}
    existing[row.symbol] = row.cumulative_supply
    dateMap.set(row.block_date, existing)
  }

  // Forward-fill missing values
  const sortedDates = Array.from(dateMap.keys()).sort()
  const lastValues: Record<string, number> = {}
  const chartData = sortedDates.map((date) => {
    const entry = dateMap.get(date)!
    for (const sym of tokens) {
      if (entry[sym] !== undefined) {
        lastValues[sym] = entry[sym]
      } else {
        entry[sym] = lastValues[sym] ?? 0
      }
    }
    return { date, ...entry }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-base font-normal">Supply Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
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
              <Area
                key={sym}
                type="monotone"
                dataKey={sym}
                stackId="1"
                stroke={TOKENS[sym as keyof typeof TOKENS].color}
                fill={TOKENS[sym as keyof typeof TOKENS].color}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
