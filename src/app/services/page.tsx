import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Filter } from "lucide-react"
import Link from "next/link"
import { services, formatPrice } from "@/lib/marketplace-data"

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Services</h1>
          <p className="text-muted-foreground">Find the perfect freelancer for your project</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div className="space-y-6 sticky top-24">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range (ETH)</label>
                  <Slider defaultValue={[0, 0.5]} max={0.5} step={0.01} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0 ETH</span>
                    <span>0.5 ETH</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Rating</label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.8">4.8+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select defaultValue="recent">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input placeholder="Search services..." className="max-w-md" />
              <Button>Search</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
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
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                        </div>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <StarIcon className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{service.averageRating || "New"}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">• {service.totalReviews} reviews</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 mt-auto flex justify-between items-center">
                      <span className="text-lg font-bold">{formatPrice(service.startingPrice, service.currency)}</span>
                      <Button>View Details</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
