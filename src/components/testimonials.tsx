"use client"

import { TextRevealCard } from "./ui/text-reveal-card"
import { AnimatedTooltip } from "./ui/animated-tooltip"
import { MovingBorder } from "./ui/moving-border"

const testimonials = [
  {
    quote: "This marketplace transformed how I find clients. The quality of projects and ease of use is unmatched.",
    author: "Sarah Johnson",
    title: "Freelance Developer",
  },
  {
    quote: "I've hired multiple freelancers here and have been consistently impressed with the talent and results.",
    author: "Michael Chen",
    title: "Startup Founder",
  },
  {
    quote: "The secure payment system and project management tools make collaboration seamless and worry-free.",
    author: "Elena Rodriguez",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TextRevealCard key={index} text={testimonial.author} revealText={testimonial.title} className="h-full">
              <p className="text-lg">{testimonial.quote}</p>
            </TextRevealCard>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center">
          <h3 className="text-2xl font-bold mb-8">Meet Our Team</h3>

          <MovingBorder borderWidth="2px" className="p-1 mb-8" containerClassName="flex justify-center">
            <AnimatedTooltip items={team} />
          </MovingBorder>

          <p className="text-center text-muted-foreground max-w-2xl">
            Our dedicated team is committed to creating the best marketplace experience for freelancers and clients
            worldwide.
          </p>
        </div>
      </div>
    </section>
  )
}
