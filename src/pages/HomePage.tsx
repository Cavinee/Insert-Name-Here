import { Navigation } from "../components/navigation"
import { Hero } from "../components/hero"
import { FeaturedServices } from "../components/featured-services"
import { Testimonials } from "../components/testimonials"
// import { SpotlightSection } from "../components/spotlight-section"
import { Footer } from "../components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <FeaturedServices />
        <Testimonials />
        {/* <SpotlightSection /> */}
      </main>
      <Footer />
    </div>
  )
}