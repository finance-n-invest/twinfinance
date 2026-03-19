/**
 * Fetch USD exchange rates from CriptoYa (Belo).
 * Currently available: ARS, BRL. Others return null.
 * Rate = local currency units per 1 USDT.
 * To convert: usd_value = local_amount / rate
 */

export interface RateEntry {
  rate: number | null
  time: number | null // unix timestamp from CriptoYa
}

export type Rates = Record<string, RateEntry>

const BELO_PAIRS: { currency: string; url: string }[] = [
  { currency: "ARS", url: "https://criptoya.com/api/belo/USDT/ARS/0.1" },
  { currency: "BRL", url: "https://criptoya.com/api/belo/USDT/BRL/0.1" },
]

async function fetchRate(url: string): Promise<{ rate: number | null; time: number | null }> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return { rate: null, time: null }
    const json = await res.json()
    const rate = typeof json.ask === "number" && json.ask > 0 ? json.ask : null
    const time = typeof json.time === "number" ? json.time : null
    return { rate, time }
  } catch {
    return { rate: null, time: null }
  }
}

export async function fetchRates(): Promise<Rates> {
  const results = await Promise.all(
    BELO_PAIRS.map(async ({ currency, url }) => ({
      currency,
      ...(await fetchRate(url)),
    }))
  )

  const rates: Rates = {
    ARS: { rate: null, time: null },
    BRL: { rate: null, time: null },
    COP: { rate: null, time: null },
    PEN: { rate: null, time: null },
    MXN: { rate: null, time: null },
  }

  for (const { currency, rate, time } of results) {
    rates[currency] = { rate, time }
  }

  return rates
}

/** Convert a local currency amount to USD. Returns null if no rate. */
export function toUsd(amount: number, currency: string, rates: Rates): number | null {
  const entry = rates[currency]
  if (entry?.rate == null || entry.rate === 0) return null
  return amount / entry.rate
}
