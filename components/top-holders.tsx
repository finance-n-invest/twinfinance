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
import { truncateAddress, formatNumber } from "@/lib/format"

interface HolderRow {
  symbol: string
  holder: string
  balance: number
  rank: number
}

interface TopHoldersProps {
  data: HolderRow[]
  selectedToken: string | null
}

export function TopHolders({ data, selectedToken }: TopHoldersProps) {
  const filtered = selectedToken
    ? data.filter((r) => r.symbol === selectedToken)
    : data.filter((r) => r.rank <= 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Top Holders{selectedToken ? ` - ${selectedToken}` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              {!selectedToken && <TableHead>Token</TableHead>}
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={`${row.symbol}-${row.holder}`}>
                <TableCell className="font-medium">{row.rank}</TableCell>
                {!selectedToken && (
                  <TableCell>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor:
                          TOKENS[row.symbol as keyof typeof TOKENS]?.color,
                        color:
                          TOKENS[row.symbol as keyof typeof TOKENS]?.color,
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
                    className="text-blue-400 hover:underline font-mono text-sm"
                  >
                    {truncateAddress(row.holder)}
                  </a>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatNumber(row.balance)}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={selectedToken ? 3 : 4}
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
