"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { WorldMap } from "./ui/world-map"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/0 pointer-events-none z-10" />

      <div className="container relative z-20">
        <div className="grid grid-cols-1 gap-8 py-12 md:py-24 items-center content-center">
          {/* Text content */}
          <div className="flex flex-col space-y-6 items-center">
            <div className="space-y-4 flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">
                Global Marketplace for <span className="text-primary">Digital Services</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] text-center">
                Connect with skilled freelancers worldwide and bring your projects to life with our decentralized
                marketplace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/browse">
                  Browse Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sell">Become a Seller</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p>Join 10,000+ freelancers and clients</p>
            </div>
          </div>
        </div>
        <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 34.0522,
              lng: -118.2437,
            }, // Los Angeles
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]}
      />
      </div>
    </div>
  )
}
