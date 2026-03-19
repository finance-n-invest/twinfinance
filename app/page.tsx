import { getLatestResults } from "@/lib/dune"
import { DUNE_QUERIES } from "@/lib/constants"
import { Dashboard } from "@/components/dashboard"

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
  } catch {
    return (
      <main className="flex-1 p-6 md:p-10">
        <Header />
        <div className="mt-8 text-center text-muted-foreground">
          <p>Failed to load data from Dune Analytics.</p>
          <p className="text-sm mt-2">
            Make sure <code>DUNE_API_KEY</code> is set and the queries have been
            executed at least once.
          </p>
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
    <div className="flex items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          TwinFinance
        </h1>
        <p className="text-muted-foreground text-sm">
          LATAM Stablecoin Adoption Dashboard
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        <span>Powered by</span>
        <a
          href="https://dune.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Dune Analytics
        </a>
        <span>on</span>
        <a
          href="https://base.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Base
        </a>
      </div>
    </div>
  )
}
