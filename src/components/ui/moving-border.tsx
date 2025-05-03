"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface MovingBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
  borderWidth?: string
  pathLength?: number
  className?: string
  containerClassName?: string
  svgClassName?: string
  backgroundClassName?: string
  borderClassName?: string
}

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "30%",
  ry = "30%",
  borderWidth = "2px",
  pathLength = 0.8,
  className,
  containerClassName,
  svgClassName,
  backgroundClassName,
  borderClassName,
  ...props
}: MovingBorderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative", containerClassName)}
      style={{
        width: "fit-content",
        height: "fit-content",
      }}
      {...props}
    >
      <div className={cn("absolute inset-0 z-[1] backdrop-blur-[2px] rounded-[inherit]", backgroundClassName)} />
      <svg
        className={cn("absolute inset-0 z-[1]", svgClassName)}
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <rect
          rx={rx}
          ry={ry}
          width="100%"
          height="100%"
          strokeWidth={borderWidth}
          pathLength={1}
          className={cn("stroke-primary animate-border-move", borderClassName)}
          style={
            {
              "--duration": `${duration}ms`,
              "--path-length": pathLength,
              strokeDasharray: 1,
              strokeDashoffset: 0,
              fill: "transparent",
            } as React.CSSProperties
          }
        />
      </svg>
      <div className={cn("relative z-[2]", className)}>{children}</div>
    </div>
  )
}
