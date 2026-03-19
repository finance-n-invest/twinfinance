"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image"

export function TwinLogo({ size = 24 }: { size?: number }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before mount, show white logo (default dark theme)
  const src = mounted && resolvedTheme === "light"
    ? "/logo-black.svg"
    : "/logo-white.svg"

  return (
    <Image
      src={src}
      alt="Twin Finance"
      width={size}
      height={size}
      className="shrink-0"
    />
  )
}
