"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: number
  interactive?: boolean
  className?: string
}

export function StarRating({ rating, onRatingChange, size = 20, interactive = false, className }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index)
    }
  }

  return (
    <div className={cn("flex", className)}>
      {[1, 2, 3, 4, 5].map((index) => {
        const filled = (hoverRating || rating) >= index

        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-all",
              filled ? "fill-yellow-500 text-yellow-500" : "fill-none text-muted-foreground",
              interactive && "cursor-pointer",
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        )
      })}
    </div>
  )
}
