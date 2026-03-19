import { NextResponse } from "next/server"
import { fetchRates } from "@/lib/rates"

export const dynamic = "force-dynamic"

export async function GET() {
  const rates = await fetchRates()
  return NextResponse.json(rates)
}
