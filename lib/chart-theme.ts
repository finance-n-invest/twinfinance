export const chartTheme = {
  light: {
    grid: "rgba(0, 0, 0, 0.08)",
    axis: "#999999",
    tooltipBg: "#ffffff",
    tooltipBorder: "1px solid rgba(0, 0, 0, 0.1)",
    tooltipColor: "#000000",
  },
  dark: {
    grid: "rgba(255, 255, 255, 0.06)",
    axis: "#666666",
    tooltipBg: "#121212",
    tooltipBorder: "1px solid rgba(255, 255, 255, 0.08)",
    tooltipColor: "#e5e5e5",
  },
} as const

export type ChartThemeColors = (typeof chartTheme)["light"]
