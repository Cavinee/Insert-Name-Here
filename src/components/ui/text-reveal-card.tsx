"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TextRevealCardProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  revealText: string
  children?: React.ReactNode
  className?: string
  revealClassName?: string
}

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
  revealClassName,
  ...props
}: TextRevealCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
      {...props}
    >
      <div className="relative z-10">
        <div className="text-base font-medium text-neutral-500 dark:text-neutral-400">{text}</div>
        <div className="mt-4 text-3xl font-bold">{children}</div>
      </div>
      <div
        className={cn(
          "absolute inset-0 z-0 bg-gradient-to-br from-primary/80 via-primary/50 to-primary/0 opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
          revealClassName,
        )}
        style={{
          maskImage: `radial-gradient(circle at ${position.x}px ${position.y}px, transparent 0%, black 100%)`,
        }}
      >
        <div className="relative z-10 h-full w-full p-8">
          <div className="text-base font-medium text-white">{text}</div>
          <div className="mt-4 text-3xl font-bold text-white">{revealText}</div>
        </div>
      </div>
    </div>
  )
}
