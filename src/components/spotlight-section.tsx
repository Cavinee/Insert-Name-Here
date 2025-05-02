"use client"

import { CardBody, CardContainer, CardItem } from "./ui/3d-card"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

export function SpotlightSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Next Project?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Whether you're looking to hire top talent or showcase your skills, our marketplace connects you with
              opportunities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link to="/browse">Find Talent</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sell">Offer Services</Link>
              </Button>
            </div>
          </div>
      </div>
    </section>
  )
}
