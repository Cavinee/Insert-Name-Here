"use client"

import { useState, useEffect } from "react"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Slider } from "../components/ui/slider"
import { Badge } from "../components/ui/badge"
import { StarIcon, Filter } from "lucide-react"

// Define the listing type (same as in SellPage)
interface Listing {
  id: string
  title: string
  description: string
  category: string
  price: number
  active: boolean
  createdAt: Date
}

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState([0, 1])
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Load listings from localStorage on component mount
  useEffect(() => {
    const savedListings = localStorage.getItem("userListings")
    if (savedListings) {
      try {
        // Parse the JSON and convert string dates back to Date objects
        const parsedListings = JSON.parse(savedListings).map((listing: any) => ({
          ...listing,
          createdAt: new Date(listing.createdAt),
        }))
        setListings(parsedListings)
        setFilteredListings(parsedListings)
      } catch (error) {
        console.error("Error parsing listings from localStorage:", error)
      }
    }
  }, [])

  // Filter listings based on search, category, and price range
  const applyFilters = () => {
    let filtered = listings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((listing) => listing.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter((listing) => listing.price >= priceRange[0] && listing.price <= priceRange[1])

    setFilteredListings(filtered)
  }

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedCategory, priceRange[0], priceRange[1]])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="creative">Creative Writing</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range (ETH)</label>
                <Slider defaultValue={priceRange} max={1} step={0.01} onValueChange={setPriceRange} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{priceRange[0]} ETH</span>
                  <span>{priceRange[1]} ETH</span>
                </div>
              </div>
              <div className="space-y-2">
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
          </aside>

          {/* Listings Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search listings..."
                className="max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={applyFilters}>Search</Button>
            </div>

            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-start gap-2">
                        <span>{listing.title}</span>
                        <Badge variant="secondary">{listing.category}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{listing.description}</p>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">New</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Created: {listing.createdAt.toLocaleDateString()}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <span className="text-lg font-bold">{listing.price.toFixed(2)} ETH</span>
                      <Button>View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <h3 className="text-lg font-medium mb-2">No listings found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
