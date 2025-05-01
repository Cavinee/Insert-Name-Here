"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { freelancers, portfolioItems, getServicesByFreelancer } from "@/lib/marketplace-data"

// Use the first freelancer as the current user
const currentUser = freelancers[0]
const userPortfolioItems = portfolioItems.filter((item) => item.freelancerId === currentUser.id)
const userServices = getServicesByFreelancer(currentUser.id)

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <Avatar className="h-32 w-32">
              <AvatarImage src={currentUser.profilePictureUrl || "/placeholder.svg"} />
              <AvatarFallback>{currentUser.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{currentUser.fullName}</h1>
                  <p className="text-xl text-highlight font-medium">{currentUser.skills[0]} Specialist</p>
                  <p className="text-muted-foreground">{currentUser.email} • Joined December 2023</p>
                </div>
                <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Save Profile" : "Edit Profile"}</Button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">{currentUser.reputationScore}</span>
                  <span className="text-muted-foreground">({currentUser.completedProjects} projects)</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>98% Job Success</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>100% On-time delivery</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">About Me</h3>
                <p className="text-muted-foreground">
                  {currentUser.skills[0]} specialist with 5+ years of experience. I build responsive, scalable solutions
                  with a focus on clean code and excellent user experience.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {currentUser.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Tabs defaultValue="portfolio">
            <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Portfolio</h2>
                <Button variant="outline">Add Portfolio Item</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userPortfolioItems.length > 0 ? (
                  userPortfolioItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground">No portfolio items yet. Add your first project!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <h2 className="text-2xl font-bold">Client Reviews</h2>

              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/placeholder.svg?text=Client${i + 1}`} />
                            <AvatarFallback>C{i + 1}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Client {i + 1}</p>
                            <p className="text-sm text-muted-foreground">Client{i + 1}.eth</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <StarIcon
                                key={j}
                                className={`h-4 w-4 ${j < 5 - (i % 2) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {i + 1} month{i > 0 ? "s" : ""} ago
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-sm text-muted-foreground mb-2">
                        Service: {userServices[i % userServices.length]?.title || "Professional Service"}
                      </p>
                      <p>
                        {
                          [
                            "Exceptional work! Delivered exactly what I needed and was very responsive throughout the process.",
                            "Great communication and quality work. Would definitely hire again for future projects.",
                            "Went above and beyond what was required. Very professional and delivered ahead of schedule.",
                          ][i]
                        }
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Services</h2>
                <Link href="/create">
                  <Button>Create New Service</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userServices.length > 0 ? (
                  userServices.slice(0, 3).map((service, i) => (
                    <Card key={service.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={
                            service.attachments?.[0]?.imageUrl ||
                            `/placeholder.svg?height=200&width=300&text=${service.category}`
                          }
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardHeader className="p-6">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <Badge variant="secondary">{service.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <StarIcon className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{service.averageRating || "New"}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">• {service.totalReviews} reviews</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">
                            {service.startingPrice.toFixed(2)} {service.currency}
                          </span>
                          <Link href={`/services/${service.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No services listed yet. Create your first service!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold">Performance Stats</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Completed Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{currentUser.completedProjects}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Active Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{Math.floor(Math.random() * 5) + 1}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{currentUser.balance.toFixed(2)} ETH</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Token Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{currentUser.tokenRewards}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Status</span>
                      <Badge
                        className={`bg-${currentUser.availabilityStatus === "Available" ? "green" : currentUser.availabilityStatus === "Busy" ? "yellow" : "red"}-500`}
                      >
                        {currentUser.availabilityStatus === "Available"
                          ? "Available for Work"
                          : currentUser.availabilityStatus === "Busy"
                            ? "Currently Busy"
                            : "On Vacation"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Response Time</span>
                      <span>Within 2 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Working Hours</span>
                      <span>Mon-Fri, 9AM-6PM UTC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Next Available Slot</span>
                      <span>{currentUser.availabilityStatus === "Available" ? "Immediately" : "In 2 weeks"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
