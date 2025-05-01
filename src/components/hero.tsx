import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 dark:from-background dark:to-background/30" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Find Expert Freelancers for Your <span className="highlight font-extrabold">Projects</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/90 dark:text-foreground/90">
            Connect with skilled professionals, hire top talent, and get your projects done efficiently and affordably.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/services">
              <Button size="lg" className="rounded-full">
                Find Services
              </Button>
            </Link>
            <Link to="/create">
              <Button size="lg" variant="outline" className="rounded-full">
                Offer Your Skills
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
