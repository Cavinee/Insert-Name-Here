import { useState } from "react"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Upload, DollarSign, Plus, X } from 'lucide-react'
import { Label } from "../components/ui/label"
import { Principal } from "@dfinity/principal";

export default function CreateServicePage() {

  const [images, setImages] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAddImage = () => {
    // Simulate adding an image
    const newImage = `/placeholder.svg?height=200&width=300&text=Image${images.length + 1}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const serviceData: ServiceData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    startingPrice: Number(formData.get("price")),
    deliveryTimeMin: Number(formData.get("deliveryTime")),
    revisions: Number(formData.get("revisions")),
    subcategory: "",
    currency: "",
    status: "ACTIVE",
    tags: [],
    tiers: [],
    contractType: "FIXED_PRICE",
    paymentMethod: "CRYPTO",
    totalReviews: 0
  };
    try{
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to submit service.");
      }
    } catch (error) {
      console.error("Error submitting service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Interface that defines the data structure to be sent to the backend
  interface ServiceData {
    title: string;
    description: string;
    category: string;
    subcategory: string;
    startingPrice: number;
    currency: string;
    deliveryTimeMin: number;
    status: "ACTIVE" | "INACTIVE" | "PENDING"; // Assuming status is an enum or string
    tags: string[];
    attachments?: string[]; // Optional list of image URLs or file references
    tiers: {
      name: string; // "Basic", "Standard", "Premium"
      price: number;
      description: string;
      deliveryTime: number;
      revisions: number;
    }[];
    contractType: "FIXED_PRICE" | "HOURLY"; // Example contract types, adjust as needed
    paymentMethod: "CRYPTO" | "BANK_TRANSFER" | "PAYPAL"; // Example payment methods, adjust as needed
    averageRating?: number; // Optional, might not be included at the time of creation
    totalReviews: number;
    revisions:number;
  
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create a New Service</h1>
          <p className="text-muted-foreground mb-8">Share your skills and start earning</p>

          <Tabs defaultValue="basic">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="gallery">Gallery & FAQ</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Service Title</Label>
                      <Input id="title" placeholder="I will..." required />
                      <p className="text-xs text-muted-foreground">
                        Your title should be attention-grabbing and accurately describe your service (max 80 characters)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
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

                    <div className="space-y-2">
                      <Label htmlFor="description">Service Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your service in detail..."
                        className="min-h-[200px]"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Be specific about what you offer, your process, and what clients can expect
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        id="tags"
                        placeholder="Add tags (press Enter)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                      <p className="text-xs text-muted-foreground">
                        Add relevant tags to help clients find your service
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button">Save & Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Packages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (ETH)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          className="pl-9"
                          step="0.01"
                          min="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-time">Delivery Time (days)</Label>
                      <Select required>
                        <SelectTrigger id="delivery-time">
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="2">2 days</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="revisions">Number of Revisions</Label>
                      <Select required>
                        <SelectTrigger id="revisions">
                          <SelectValue placeholder="Select number of revisions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 revision</SelectItem>
                          <SelectItem value="2">2 revisions</SelectItem>
                          <SelectItem value="3">3 revisions</SelectItem>
                          <SelectItem value="5">5 revisions</SelectItem>
                          <SelectItem value="unlimited">Unlimited revisions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>What's Included</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input placeholder="e.g., Source files" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input placeholder="e.g., Commercial use" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input placeholder="e.g., 24/7 support" />
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" /> Add More
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="button">Save & Continue</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery & FAQ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Service Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddImage}
                          className="aspect-video flex flex-col items-center justify-center border border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Add Image</span>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Add up to 5 images showcasing your service. First image will be the cover.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Frequently Asked Questions</Label>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Input placeholder="Question" />
                          <Textarea placeholder="Answer" />
                        </div>
                        <div className="space-y-2">
                          <Input placeholder="Question" />
                          <Textarea placeholder="Answer" />
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add FAQ
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      
                        <Button type="submit">
                          
                        </Button>
                      
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </form>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}