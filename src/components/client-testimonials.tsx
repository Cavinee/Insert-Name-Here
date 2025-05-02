"use client"

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
  {
    quote: "As a freelancer, I've doubled my income since joining this platform. The client matching is spot on.",
    name: "David Kim",
    title: "UI/UX Designer",
  },
  {
    quote:
      "The quality of talent on this platform is exceptional. I found the perfect developer for my project in days.",
    name: "Jessica Williams",
    title: "Product Manager",
  },
  {
    quote:
      "The escrow payment system gives me peace of mind for every project. I'll never go back to traditional freelancing.",
    name: "Thomas Brown",
    title: "Content Creator",
  },
]

export function ClientTestimonials() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied clients and freelancers
          </p>
        </div>

        <div className="mx-auto">
          <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        </div>
      </div>
    </section>
  )
}
