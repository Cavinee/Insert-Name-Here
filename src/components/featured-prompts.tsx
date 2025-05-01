import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"
import { services } from "@/lib/marketplace-data"

// Renamed to FeaturedServices
export function FeaturedPrompts() {
  // Get the top 3 services with highest ratings
  const featuredServices = services
    .filter((service) => service.averageRating !== null)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 3)

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Featured Services</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <Link href={`/services/${service.id}`} key={service.id}>
              <Card className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">{service.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{service.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <StarIcon className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{service.averageRating}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 mt-auto flex justify-between items-center">
                  <span className="text-lg font-bold">
                    {service.startingPrice.toFixed(2)} {service.currency}
                  </span>
                  <Button>View Details</Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
