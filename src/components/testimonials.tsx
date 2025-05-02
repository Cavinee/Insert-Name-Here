"use client"

import { TextRevealCard } from "./ui/text-reveal-card"
import { AnimatedTooltip } from "./ui/animated-tooltip"
import { MovingBorder } from "./ui/moving-border"
import { InfiniteMovingCards } from "./ui/infinite-moving-cards"

const testimonials = [
  {
    quote: "This marketplace transformed how I find clients. The quality of projects and ease of use is unmatched.",
    name: "Sarah Johnson",
    title: "Freelance Developer",
  },
  {
    quote: "I've hired multiple freelancers here and have been consistently impressed with the talent and results.",
    name: "Michael Chen",
    title: "Startup Founder",
  },
  {
    quote: "The secure payment system and project management tools make collaboration seamless and worry-free.",
    name: "Elena Rodriguez",
    title: "Marketing Director",
  },
]

const team = [
  {
    id: 1,
    name: "John Smith",
    designation: "CEO & Founder",
    image: "/placeholder.svg?height=100&width=100&text=JS",
  },
  {
    id: 2,
    name: "Lisa Wong",
    designation: "CTO",
    image: "/placeholder.svg?height=100&width=100&text=LW",
  },
  {
    id: 3,
    name: "Michael Brown",
    designation: "Head of Design",
    image: "/placeholder.svg?height=100&width=100&text=MB",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    designation: "Marketing Lead",
    image: "/placeholder.svg?height=100&width=100&text=SJ",
  },
  {
    id: 5,
    name: "David Lee",
    designation: "Product Manager",
    image: "/placeholder.svg?height=100&width=100&text=DL",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied clients and freelancers on our platform
          </p>
        </div>

      <div className="my-10">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
        />
      </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-8">Meet Our Team</h3>

          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={team} />
          </div>

          <p className="text-center text-muted-foreground max-w-2xl">
            Our dedicated team is committed to creating the best marketplace experience for freelancers and clients
            worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}
