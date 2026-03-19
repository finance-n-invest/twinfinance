import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import "./globals.css"

export const metadata: Metadata = {
  title: "Twin Stablecoins - Adoption Dashboard",
  description:
    "Track adoption metrics for Twin LATAM stablecoins: ARGt, BRAt, COLt, PERt on Base",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
