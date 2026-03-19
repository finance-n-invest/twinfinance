import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const apiKey = process.env.DUNE_API_KEY ?? ""
  const hasKey = apiKey.length > 0
  const keyPreview = hasKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "(empty)"

  // Try a minimal Dune API call
  let duneStatus = "not tested"
  let duneError = ""
  if (hasKey) {
    try {
      const res = await fetch("https://api.dune.com/api/v1/query/6865125/results?limit=1", {
        headers: {
          "X-DUNE-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })
      if (res.ok) {
        const json = await res.json()
        const rowCount = json.result?.rows?.length ?? 0
        duneStatus = `OK (${res.status}, ${rowCount} rows)`
      } else {
        const body = await res.text().catch(() => "")
        duneStatus = `FAILED (${res.status})`
        duneError = body.slice(0, 300)
      }
    } catch (err) {
      duneStatus = "EXCEPTION"
      duneError = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json({
    ok: hasKey && duneStatus.startsWith("OK"),
    env: {
      DUNE_API_KEY_SET: hasKey,
      DUNE_API_KEY_PREVIEW: keyPreview,
      NODE_ENV: process.env.NODE_ENV,
    },
    dune: {
      status: duneStatus,
      error: duneError || undefined,
    },
    timestamp: new Date().toISOString(),
  })
}
