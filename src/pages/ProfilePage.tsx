"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { StarIcon, Clock, CheckCircle } from "lucide-react"
import { freelancers, portfolioItems, getServicesByFreelancer } from "../lib/marketplace-data"

export default function ProfilePage() {
  const { id } = useParams<{ id?: string }>()

  // Use the first freelancer as the current user or find by ID if provided
  const currentUser = id ? freelancers.find((f) => f.id === id) || freelancers[0] : freelancers[0]

  const userPortfolioItems = portfolioItems.filter((item) => item.freelancerId === currentUser.id)
  const userServices = getServicesByFreelancer(currentUser.id)

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
                  <span className="text-foreground/80">({currentUser.completedProjects} projects)</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>98% Job Success</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-5 w-5 text-foreground/80" />
                  <span>100% On-time delivery</span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">About Me</h3>
                <p className="text-foreground/80">
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

            {/* Other tabs content omitted for brevity */}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
