"use client"

import { Link } from "react-router-dom"
import { Sparkles } from "lucide-react";
import { FeaturedServicesList } from "./featured-services-list";

const featuredServices = [
  {
    title: "Web Development",
    description: "Get your website built by expert developers using the latest technologies.",
    link: "/services?category=WebDevelopment",
  },
  {
    title: "Mobile Development",
    description: "Build responsive and high-performance mobile applications.",
    link: "/services?category=MobileDevelopment",
  },
  {
    title: "Machine Learning",
    description: "Leverage AI and machine learning to solve complex problems.",
    link: "/services?category=MachineLearning",
  },
  {
    title: "Cloud Services",
    description: "Scale your business with cloud computing solutions.",
    link: "/services?category=CloudServices",
  },
  {
    title: "Software Testing",
    description: "Ensure the quality of your software with professional testing services.",
    link: "/services?category=SoftwareTesting",
  },
  {
    title: "Technical Writing",
    description: "Produce clear and concise technical documentation.",
    link: "/services?category=TechnicalWriting",
  },
]

export function FeaturedServices() {
  return (
    <div className="container mx-auto my-8 mt-20 px-4">
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
 