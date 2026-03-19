export const DUNE_QUERIES = {
  SUPPLY_OVER_TIME: 6865121,
  HOLDERS_OVER_TIME: 6865122,
  DAILY_ACTIVITY: 6865123,
  CURRENT_SNAPSHOT: 6865125,
  TOP_HOLDERS: 6865126,
} as const

export const TOKENS = {
  ARGt: {
    symbol: "ARGt",
    name: "Argentine Peso",
    currency: "ARS",
    contract: "0xf016413834e6d1a14f3d628b11d6ef725a6bdbdd",
    color: "#3b82f6", // blue
    flag: "\u{1F1E6}\u{1F1F7}",
    hidden: false,
  },
  BRAt: {
    symbol: "BRAt",
    name: "Brazilian Real",
    currency: "BRL",
    contract: "0xfee29845569570f8e0119291dff77b7b93283aab",
    color: "#22c55e", // green
    flag: "\u{1F1E7}\u{1F1F7}",
    hidden: false,
  },
  COLt: {
    symbol: "COLt",
    name: "Colombian Peso",
    currency: "COP",
    contract: "0xd70ad085684b2a9f4b5d54d7bdb2eca37a273216",
    color: "#eab308", // yellow
    flag: "\u{1F1E8}\u{1F1F4}",
    hidden: false,
  },
  PERt: {
    symbol: "PERt",
    name: "Peruvian Sol",
    currency: "PEN",
    contract: "0xd09aba2969b822d66dc4bc3bb58ee520bcf9f0c3",
    color: "#ef4444", // red
    flag: "\u{1F1F5}\u{1F1EA}",
    hidden: false,
  },
  MEXt: {
    symbol: "MEXt",
    name: "Mexican Peso",
    currency: "MXN",
    contract: "0x59863989d080b22476db95656d0c3cc18be92214",
    color: "#f97316", // orange
    flag: "\u{1F1F2}\u{1F1FD}",
    hidden: true, // hidden until minting begins
  },
} as const

export type TokenSymbol = keyof typeof TOKENS

/** Only tokens visible in the dashboard UI */
export const TOKEN_SYMBOLS = (Object.keys(TOKENS) as TokenSymbol[]).filter(
  (sym) => !TOKENS[sym].hidden
)

/** All token contracts including hidden (for Dune queries) */
export const ALL_TOKEN_SYMBOLS = Object.keys(TOKENS) as TokenSymbol[]

/** All Base chain token contract addresses (lowercase) for Dune SQL IN clauses */
export const BASE_TOKEN_CONTRACTS = Object.values(TOKENS).map(
  (t) => t.contract
)

export const BASESCAN_ADDRESS_URL = "https://basescan.org/address"
