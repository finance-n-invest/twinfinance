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
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TOKENS, TOKEN_SYMBOLS } from "@/lib/constants"
import { formatNumber, formatWithCurrency, formatUsd } from "@/lib/format"
import { chartTheme } from "@/lib/chart-theme"
import type { Rates } from "@/lib/rates"
import { toUsd } from "@/lib/rates"

interface SupplyRow {
  block_date: string
  symbol: string
  cumulative_supply: number
}

interface SupplyChartProps {
  data: SupplyRow[]
  selectedToken: string | null
  rates: Rates
}

export function SupplyChart({ data, selectedToken, rates }: SupplyChartProps) {
  const { resolvedTheme } = useTheme()
  const colors = chartTheme[resolvedTheme === "dark" ? "dark" : "light"]

  const tokens = selectedToken ? [selectedToken] : TOKEN_SYMBOLS

  const dateMap = new Map<string, Record<string, number>>()
  for (const row of data) {
    if (selectedToken && row.symbol !== selectedToken) continue
    const existing = dateMap.get(row.block_date) ?? {}
    existing[row.symbol] = row.cumulative_supply
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

  // Custom tooltip formatter with currency
  const tooltipFormatter = (value: number | string | (number | string)[], name: string) => {
    const num = Number(value)
    const token = TOKENS[name as keyof typeof TOKENS]
    if (!token) return [formatNumber(num), name]
    const label = `${name} (${token.currency})`
    const formatted = formatWithCurrency(num, token.currency)
    const usd = toUsd(num, token.currency, rates)
    const display = usd != null ? `${formatted} (${formatUsd(usd)})` : formatted
    return [display, label]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-base font-normal">Supply Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke={colors.axis}
            />
            <YAxis
              tickFormatter={formatNumber}
              tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              stroke={colors.axis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: colors.tooltipBorder,
                borderRadius: "8px",
                color: colors.tooltipColor,
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
              }}
              formatter={tooltipFormatter as never}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => {
                const token = TOKENS[value as keyof typeof TOKENS]
                return token ? `${value} (${token.currency})` : value
              }}
            />
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
