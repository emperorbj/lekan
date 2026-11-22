"use client"

import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"

// lottie-web touches `window`, so it must never render on the server.
// The svg-only build is smaller than the full engine and all we need.
const LottieSvg = dynamic(() => import("lottie-react").then((m) => m.LottieSvg), {
  ssr: false,
  loading: () => null,
})

interface LottiePlayerProps {
  animationData: object
  loop?: boolean
  className?: string
  label?: string
}

export function LottiePlayer({ animationData, loop = true, className, label }: LottiePlayerProps) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("shrink-0", className)}
    >
      <LottieSvg src={animationData} loop={loop} autoplay className="size-full" />
    </div>
  )
}
