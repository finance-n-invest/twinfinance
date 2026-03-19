/**
 * Fetch USD exchange rates from CriptoYa (Belo).
 * Currently available: ARS, BRL. Others return null.
 * Rate = local currency units per 1 USDT.
 * To convert: usd_value = local_amount / rate
 */

export type Rates = Record<string, number | null>

const BELO_PAIRS: { currency: string; url: string }[] = [
  { currency: "ARS", url: "https://criptoya.com/api/belo/USDT/ARS/0.1" },
  { currency: "BRL", url: "https://criptoya.com/api/belo/USDT/BRL/0.1" },
]

async function fetchRate(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    const json = await res.json()
    return typeof json.ask === "number" && json.ask > 0 ? json.ask : null
  } catch {
    return null
  }
}

export async function fetchRates(): Promise<Rates> {
  const results = await Promise.all(
    BELO_PAIRS.map(async ({ currency, url }) => ({
      currency,
      rate: await fetchRate(url),
    }))
  )

  const rates: Rates = {
    ARS: null,
    BRL: null,
    COP: null,
    PEN: null,
    MXN: null,
  }

  for (const { currency, rate } of results) {
    rates[currency] = rate
  }

  return rates
}

/** Convert a local currency amount to USD. Returns null if no rate. */
export function toUsd(amount: number, currency: string, rates: Rates): number | null {
  const rate = rates[currency]
  if (rate == null || rate === 0) return null
  return amount / rate
}
