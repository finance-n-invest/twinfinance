const DUNE_API_KEY = process.env.DUNE_API_KEY ?? ""
const BASE = "https://api.dune.com/api/v1"

function headers() {
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
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Dune results ${queryId}: ${res.status}`)
  const json = await res.json()
  return { rows: json.result?.rows ?? [] }
}
