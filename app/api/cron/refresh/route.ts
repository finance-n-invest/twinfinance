import { NextResponse } from "next/server"
import { DUNE_QUERIES } from "@/lib/constants"

export const dynamic = "force-dynamic"

const DUNE_API_KEY = process.env.DUNE_API_KEY ?? ""
const BASE = "https://api.dune.com/api/v1"

async function executeQuery(queryId: number): Promise<string> {
  const res = await fetch(`${BASE}/query/${queryId}/execute`, {
    method: "POST",
    headers: {
      "X-DUNE-API-KEY": DUNE_API_KEY,
      "Content-Type": "application/json",
    },
    body: "{}",
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    return `FAILED (${res.status}): ${body.slice(0, 100)}`
  }
  const json = await res.json()
  return `OK (execution_id: ${json.execution_id})`
}

export async function GET(request: Request) {
  // Verify this is called by Vercel Cron — reject if CRON_SECRET is not set or doesn't match
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!DUNE_API_KEY) {
    return NextResponse.json({ error: "DUNE_API_KEY not set" }, { status: 500 })
  }

  const queries = [
    { name: "Supply Over Time", id: DUNE_QUERIES.SUPPLY_OVER_TIME },
    { name: "Holders Over Time", id: DUNE_QUERIES.HOLDERS_OVER_TIME },
    { name: "Daily Activity", id: DUNE_QUERIES.DAILY_ACTIVITY },
    { name: "Current Snapshot", id: DUNE_QUERIES.CURRENT_SNAPSHOT },
    { name: "Top Holders", id: DUNE_QUERIES.TOP_HOLDERS },
  ]

  const results = await Promise.all(
    queries.map(async (q) => ({
      name: q.name,
      queryId: q.id,
      result: await executeQuery(q.id),
    }))
  )

  return NextResponse.json({
    refreshedAt: new Date().toISOString(),
    queries: results,
  })
}
