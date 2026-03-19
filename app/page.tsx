import { getLatestResults } from "@/lib/dune"
import { DUNE_QUERIES } from "@/lib/constants"
import { Dashboard } from "@/components/dashboard"
import { ThemeToggle } from "@/components/theme-toggle"

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
  try {
    data = await fetchDuneData()
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
        />
      </div>
    </main>
  )
}

function Header() {
  return (
    <div className="flex items-center justify-between border-b border-border pb-6">
      <div className="flex items-center gap-3">
        {/* Twin logo icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="30" height="30" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"/>
          <path d="M8 12h16M8 20h16M12 8v16M20 8v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-muted-foreground"/>
          <circle cx="16" cy="16" r="5" stroke="#ff6602" strokeWidth="1.5"/>
          <path d="M13 16h6M16 13v6" stroke="#ff6602" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <div>
          <h1 className="font-serif text-xl font-medium tracking-tight text-foreground">
            Twin Finance
          </h1>
          <p className="text-muted-foreground text-xs tracking-wide uppercase">
            Stablecoin Adoption Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <a
          href="https://www.twin.finance"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          twin.finance
        </a>
        <span className="text-border">|</span>
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
        <a
          href="https://base.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Base
        </a>
        <span className="text-border">|</span>
        <ThemeToggle />
      </div>
    </div>
  )
}
