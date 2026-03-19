import { getLatestResults } from "@/lib/dune"
import { DUNE_QUERIES } from "@/lib/constants"
import { Dashboard } from "@/components/dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { TwinLogo } from "@/components/twin-logo"
import { fetchRates, type Rates } from "@/lib/rates"

// Force server-side rendering on every request (with ISR caching on fetches).
// This prevents the page from being statically generated at build time,
// which would fail if DUNE_API_KEY isn't available during the build step.
export const dynamic = "force-dynamic"

async function fetchDuneData() {
  const [snapshot, supply, holders, activity, topHolders] = await Promise.all([
    getLatestResults(DUNE_QUERIES.CURRENT_SNAPSHOT),
    getLatestResults(DUNE_QUERIES.SUPPLY_OVER_TIME),
    getLatestResults(DUNE_QUERIES.HOLDERS_OVER_TIME),
    getLatestResults(DUNE_QUERIES.DAILY_ACTIVITY),
    getLatestResults(DUNE_QUERIES.TOP_HOLDERS),
  ])
  return { snapshot, supply, holders, activity, topHolders }
}

export default async function Home() {
  let data
  let rates: Rates = { ARS: { rate: null, time: null }, BRL: { rate: null, time: null }, COP: { rate: null, time: null }, PEN: { rate: null, time: null }, MXN: { rate: null, time: null } }
  try {
    ;[data, rates] = await Promise.all([fetchDuneData(), fetchRates()])
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return (
      <main className="flex-1 p-6 md:p-10">
        <Header />
        <div className="mt-8 text-center text-muted-foreground space-y-2">
          <p>Failed to load data from Dune Analytics.</p>
          <p className="text-sm">
            Make sure <code className="bg-muted px-1.5 py-0.5 rounded text-xs">DUNE_API_KEY</code> is set and the queries have been
            executed at least once.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-destructive mt-4 font-mono">{message}</p>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      <Header />
      <div className="mt-8">
        <Dashboard
          snapshot={data.snapshot.rows as never[]}
          supply={data.supply.rows as never[]}
          holders={data.holders.rows as never[]}
          activity={data.activity.rows as never[]}
          topHolders={data.topHolders.rows as never[]}
          rates={rates}
        />
      </div>
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div className="flex items-center gap-3">
        <TwinLogo size={44} />
        <div>
          <h1 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Twin Finance
          </h1>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Stablecoin Adoption Dashboard
          </p>
        </div>
      </div>
      <ThemeToggle />
    </div>
  )
}

function Footer() {
  return (
    <div className="mt-12 border-t border-border pt-6 pb-2 flex flex-col items-center gap-2 text-xs text-muted-foreground">
      <a
        href="https://www.twin.finance"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
      >
        twin.finance
      </a>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          Data by{" "}
          <a
            href="https://dune.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6602] hover:underline"
          >
            Dune
          </a>
        </span>
        <span className="text-border">|</span>
        <span className="flex items-center gap-1.5">
          Rates by{" "}
          <a
            href="https://criptoya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6602] hover:underline"
          >
            CriptoYa
          </a>
        </span>
      </div>
    </div>
  )
}
