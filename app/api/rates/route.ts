import { NextResponse } from "next/server"
import { fetchRates } from "@/lib/rates"

// Cache rates for 60 seconds at the edge to prevent abuse
export const revalidate = 60

export async function GET() {
  const rates = await fetchRates()
  return NextResponse.json(rates, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  })
}
