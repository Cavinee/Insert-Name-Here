"use client"

import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react";
import { FeaturedServicesList } from "./featured-services-list";

const featuredServices = [
  {
    title: "Web Development",
    description: "Get your website built by expert developers using the latest technologies.",
    link: "/services?category=development",
  },
  {
    title: "UI/UX Design",
    description: "Create beautiful, intuitive interfaces that users will love.",
    link: "/services?category=design",
  },
  {
    title: "Content Writing",
    description: "Engaging content that converts visitors into customers.",
    link: "/services?category=writing",
  },
  {
    title: "Digital Marketing",
    description: "Reach your target audience and grow your business online.",
    link: "/services?category=marketing",
  },
  {
    title: "Video Production",
    description: "Professional videos that tell your brand's story.",
    link: "/services?category=video",
  },
  {
    title: "AI Services",
    description: "Leverage artificial intelligence to automate and optimize your business.",
    link: "/services?category=ai",
  },
]

export function FeaturedServices() {
  return (
    <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover top-rated services from our global community of freelancers
            </p>
        </div>

        <FeaturedServicesList />

        <div className="text-center mt-12">
            <Link
            to="/services"
            className="inline-flex items-center justify-center h-12 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
            >
            View All Services
            </Link>
        </div>
    </div>
  )
}
 