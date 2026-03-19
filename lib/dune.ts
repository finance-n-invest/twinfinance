const DUNE_API_KEY = process.env.DUNE_API_KEY ?? ""
const BASE = "https://api.dune.com/api/v1"

function headers() {
  if (!DUNE_API_KEY) {
    throw new Error("DUNE_API_KEY environment variable is not set")
  }
  return {
    "X-DUNE-API-KEY": DUNE_API_KEY,
    "Content-Type": "application/json",
  }
}

export async function getLatestResults<T = Record<string, unknown>>(
  queryId: number
): Promise<{ rows: T[] }> {
  const res = await fetch(`${BASE}/query/${queryId}/results`, {
    headers: headers(),
    // no-store avoids the Next.js Data Cache (which persists across deploys
    // on Vercel and could serve a stale error response).  The Dune API itself
    // returns cached query results, so we're not hammering the database.
    cache: "no-store",
  })
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(
      `Dune query ${queryId} failed (${res.status}): ${body.slice(0, 200)}`
    )
  }
  const json = await res.json()
  return { rows: json.result?.rows ?? [] }
}
