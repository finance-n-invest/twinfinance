import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Twin Finance - Token Adoption Dashboard",
  description:
    "Track adoption metrics for Twin Finance LATAM stablecoins: ARGt, BRAt, COLt, PERt, MEXt on Base",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
