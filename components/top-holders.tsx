"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BASESCAN_ADDRESS_URL, TOKENS } from "@/lib/constants"
import { truncateAddress, formatWithCurrency, formatUsd } from "@/lib/format"
import type { Rates } from "@/lib/rates"
import { toUsd } from "@/lib/rates"

interface HolderRow {
  symbol: string
  holder: string
  balance: number
  rank: number
}

interface TopHoldersProps {
  data: HolderRow[]
  selectedToken: string | null
  rates: Rates
}

export function TopHolders({ data, selectedToken, rates }: TopHoldersProps) {
  const filtered = selectedToken
    ? data.filter((r) => r.symbol === selectedToken)
    : data.filter((r) => r.rank <= 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-base font-normal">
          Top Holders{selectedToken ? ` \u2014 ${selectedToken}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-xs uppercase tracking-wide">#</TableHead>
              {!selectedToken && <TableHead className="text-xs uppercase tracking-wide">Token</TableHead>}
              <TableHead className="text-xs uppercase tracking-wide">Address</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wide">Balance</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wide">USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => {
              const token = TOKENS[row.symbol as keyof typeof TOKENS]
              const currency = token?.currency ?? ""
              const usd = toUsd(row.balance, currency, rates)
              return (
                <TableRow key={`${row.symbol}-${row.holder}`}>
                  <TableCell className="font-mono text-muted-foreground">{row.rank}</TableCell>
                  {!selectedToken && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: token?.color,
                          color: token?.color,
                        }}
                      >
                        {row.symbol}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <a
                      href={`${BASESCAN_ADDRESS_URL}/${row.holder}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ff6602] hover:underline font-mono text-sm"
                    >
                      {truncateAddress(row.holder)}
                    </a>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatWithCurrency(row.balance, currency)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {usd != null ? formatUsd(usd) : "\u2014"}
                  </TableCell>
                </TableRow>
              )
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={selectedToken ? 4 : 5}
                  className="text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
