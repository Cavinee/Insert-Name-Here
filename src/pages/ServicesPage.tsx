import { useState } from "react"
import { Link } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Slider } from "../components/ui/slider"
import { Badge } from "../components/ui/badge"
import { StarIcon, Filter } from "lucide-react"
import { services, formatPrice } from "../lib/marketplace-data"

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRating, setSelectedRating] = useState("any")
  const [selectedSort, setSelectedSort] = useState("recent")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [filteredServices, setFilteredServices] = useState(services)
  const [searchTerm, setSearchTerm] = useState("")

  function applyFilters() {
    let filtered = services.filter((service) => {
      const matchCategory = selectedCategory === "all" || service.category === selectedCategory
      const matchRating = selectedRating === "any" || (service.averageRating ?? 0) >= parseFloat(selectedRating)
      const matchPrice =
        (service.startingPrice ?? 0) >= priceRange[0] && (service.startingPrice ?? 0) <= priceRange[1]
      const matchSearch = searchTerm.trim() === "" || service.title.toLowerCase().includes(searchTerm.toLowerCase())
  
      // Debug log
      console.log("FILTER CHECK:", {
        title: service.title,
        category: service.category,
        averageRating: service.averageRating,
        startingPrice: service.startingPrice,
        matchCategory,
        matchRating,
        matchPrice,
        matchSearch
      })
  
      return matchCategory && matchRating && matchPrice && matchSearch
    })
  
    // Sort
    if (selectedSort === "price-low") {
      filtered.sort((a, b) => a.startingPrice - b.startingPrice)
    } else if (selectedSort === "price-high") {
      filtered.sort((a, b) => b.startingPrice - a.startingPrice)
    } else if (selectedSort === "popular") {
      filtered.sort((a, b) => b.totalReviews - a.totalReviews)
    } else if (selectedSort === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  
    setFilteredServices(filtered)
  }
  

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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="WebDevelopment">Web Development</SelectItem>
                      <SelectItem value="MobileDevelopment">Mobile Development</SelectItem>
                      <SelectItem value="MachineLearning">Machine Learning</SelectItem>
                      <SelectItem value="CloudServices">Cloud Services</SelectItem>
                      <SelectItem value="SoftwareTesting">Software Testing</SelectItem>
                      <SelectItem value="TechnicalWriting">Technical Writing</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="AutomationAndScripting">Automation and Scripting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Price Range (ETH)</label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={200} step={1} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{priceRange[0].toFixed(2)} ETH</span>
                    <span>{priceRange[1].toFixed(2)} ETH</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Rating</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
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
                  <Select value={selectedSort} onValueChange={setSelectedSort}>
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
              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search services..."
                className="max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={applyFilters}>Search</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link to={`/services/${service.id}`} key={service.id}>
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
