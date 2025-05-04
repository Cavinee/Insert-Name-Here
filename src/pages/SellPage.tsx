"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Upload, DollarSign, Pencil, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "../components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"
import { categories, subcategories, type Listing } from "../lib/marketplace-data"

export default function SellPage() {
  const { toast } = useToast()
  const [listings, setListings] = useState<Listing[]>([])
  const [activeTab, setActiveTab] = useState("new")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [price, setPrice] = useState("")
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  // Edit state
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

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
      } catch (error) {
        console.error("Error parsing listings from localStorage:", error)
      }
    }
  }, [])

  // Save listings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userListings", JSON.stringify(listings))
  }, [listings])

  // Update subcategories when category changes
  useEffect(() => {
    if (category) {
      setAvailableSubcategories(subcategories[category] || [])
      setSubcategory("")
    } else {
      setAvailableSubcategories([])
      setSubcategory("")
    }
  }, [category])

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !price) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newListing: Listing = {
      id: editingListing ? editingListing.id : `listing-${Date.now()}`,
      title,
      description,
      category,
      subcategory: subcategory || undefined,
      price: Number.parseFloat(price),
      currency: "ETH",
      active: true,
      createdAt: editingListing ? editingListing.createdAt : new Date(),
      freelancerId: "freelancer-1", // Default to first freelancer
      totalReviews: 0,
      attachments: [
        {
          id: `attachment-${Date.now()}`,
          imageUrl: "/placeholder.svg?height=300&width=500&text=New+Listing",
          type: "image",
        },
      ],
    }

    if (editingListing) {
      // Update existing listing
      setListings(listings.map((listing) => (listing.id === editingListing.id ? newListing : listing)))
      setEditingListing(null)
      toast({
        title: "Listing updated",
        description: "Your listing has been successfully updated.",
      })
    } else {
      // Add new listing
      setListings([...listings, newListing])
      toast({
        title: "Listing created",
        description: "Your listing has been successfully created.",
      })
    }

    // Reset form
    resetForm()
    // Switch to My Listings tab
    setActiveTab("listings")
  }

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing)
    setTitle(listing.title)
    setDescription(listing.description)
    setCategory(listing.category)

    // Set subcategories for this category
    setAvailableSubcategories(subcategories[listing.category] || [])

    // Set subcategory if it exists
    if (listing.subcategory) {
      setSubcategory(listing.subcategory)
    } else {
      setSubcategory("")
    }

    setPrice(listing.price.toString())
    setActiveTab("new")
  }

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter((listing) => listing.id !== id))
    setDeleteConfirmId(null)
    toast({
      title: "Listing deleted",
      description: "Your listing has been successfully deleted.",
    })
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("")
    setSubcategory("")
    setPrice("")
    setEditingListing(null)
  }

  const cancelEdit = () => {
    resetForm()
    if (editingListing) {
      setActiveTab("listings")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">{editingListing ? "Edit Listing" : "New Listing"}</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{editingListing ? "Edit Listing" : "Create a New Listing"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmitListing} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        placeholder="Enter listing title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe your listing..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {category && availableSubcategories.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subcategory</label>
                        <Select value={subcategory} onValueChange={setSubcategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSubcategories.map((subcat) => (
                              <SelectItem key={subcat} value={subcat}>
                                {subcat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price (ETH)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0.00"
                          className="pl-9"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload Listing File</label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop your listing file here, or click to browse
                        </p>
                        <Input type="file" className="hidden" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {editingListing && (
                        <Button type="button" variant="outline" onClick={cancelEdit} className="flex-1">
                          Cancel
                        </Button>
                      )}
                      <Button type="submit" className="flex-1">
                        {editingListing ? "Update Listing" : "Submit Listing"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="mt-6">
              <div className="grid gap-6">
                {listings.length > 0 ? (
                  listings.map((listing) => (
                    <Card key={listing.id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{listing.title}</span>
                          <Badge>{listing.active ? "Active" : "Inactive"}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{listing.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline">{listing.category}</Badge>
                          {listing.subcategory && <Badge variant="outline">{listing.subcategory}</Badge>}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">
                            {listing.price.toFixed(2)} {listing.currency}
                          </span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditListing(listing)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>

                            <AlertDialog
                              open={deleteConfirmId === listing.id}
                              onOpenChange={(open) => {
                                if (!open) setDeleteConfirmId(null)
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" onClick={() => setDeleteConfirmId(listing.id)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your listing.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteListing(listing.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No listings yet</h3>
                    <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
                    <Button onClick={() => setActiveTab("new")}>Create Your First Listing</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
