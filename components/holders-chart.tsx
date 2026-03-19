"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOKENS, TOKEN_SYMBOLS } from "@/lib/constants"

interface HoldersRow {
  block_date: string
  symbol: string
  cumulative_holders: number
}

interface HoldersChartProps {
  data: HoldersRow[]
  selectedToken: string | null
}

export function HoldersChart({ data, selectedToken }: HoldersChartProps) {
  const tokens = selectedToken ? [selectedToken] : TOKEN_SYMBOLS

  const dateMap = new Map<string, Record<string, number>>()
  for (const row of data) {
    if (selectedToken && row.symbol !== selectedToken) continue
    const existing = dateMap.get(row.block_date) ?? {}
    existing[row.symbol] = row.cumulative_holders
    dateMap.set(row.block_date, existing)
  }

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
        <CardTitle className="font-serif text-base font-normal">Holders Growth</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke="#666666"
            />
            <YAxis
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
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {tokens.map((sym) => (
              <Line
                key={sym}
                type="monotone"
                dataKey={sym}
                stroke={TOKENS[sym as keyof typeof TOKENS].color}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
