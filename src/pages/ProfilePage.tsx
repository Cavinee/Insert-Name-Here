"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Switch } from "../components/ui/switch"
import { Separator } from "../components/ui/separator"
import { useToast } from "../components/ui/use-toast"
import { StarIcon, Clock, CheckCircle, X, Plus, Save, Edit, Camera } from "lucide-react"
import { freelancers, portfolioItems, getServicesByFreelancer } from "../lib/marketplace-data"
export default function ProfilePage() {
  const { id } = useParams<{ id?: string }>()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use the first freelancer as the current user or find by ID if provided
  const initialUser = id ? freelancers.find((f) => f.id === id) || freelancers[0] : freelancers[0]

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState({ ...initialUser })
  const [newSkill, setNewSkill] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [availability, setAvailability] = useState(true)

  const userPortfolioItems = portfolioItems.filter((item) => item.freelancerId === currentUser.id)
  const userServices = getServicesByFreelancer(currentUser.id)

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're currently editing, this means we're canceling
      setCurrentUser({ ...initialUser }) // Reset to original data
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleSaveProfile = () => {
    setIsLoading(true)

    // Validate form
    if (!currentUser.fullName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty",
      })
      setIsLoading(false)
      return
    }

    if (!currentUser.email.trim() || !currentUser.email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call to save profile
    setTimeout(() => {
      setIsLoading(false)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    }, 1000)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !currentUser.skills.includes(newSkill.trim())) {
      setCurrentUser({
        ...currentUser,
        skills: [...currentUser.skills, newSkill.trim()],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setCurrentUser({
      ...currentUser,
      skills: currentUser.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
      setCurrentUser({
        ...currentUser,
        profilePictureUrl: imageUrl,
      })
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={currentUser.profilePictureUrl || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={triggerFileInput}
                >
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  {isEditing ? (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={currentUser.fullName}
                        onChange={(e) => setCurrentUser({ ...currentUser, fullName: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold">{currentUser.fullName}</h1>
                  )}

                  {isEditing ? (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Web Developer, UI Designer"
                        defaultValue={`${currentUser.skills[0]} Specialist`}
                      />
                    </div>
                  ) : (
                    <p className="text-xl text-highlight font-medium">{currentUser.skills[0]} Specialist</p>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        placeholder="Your email address"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{currentUser.email} • Joined December 2023</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleEditToggle} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEditToggle}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {!isEditing && (
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
              )}

              {/* {isEditing ? (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="availability">Available for work</Label>
                    <Switch id="availability" checked={availability} onCheckedChange={setAvailability} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    <Textarea
                      id="bio"
                      value={currentUser.bio || ""}
                      onChange={(e) => setCurrentUser({ ...currentUser, bio: e.target.value })}
                      placeholder="Tell clients about yourself, your experience, and your expertise"
                      rows={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">About Me</h3>
                  <p className="text-foreground/80">
                    {currentUser.bio ||
                      `${currentUser.skills[0]} specialist with 5+ years of experience. I build responsive, scalable solutions
                      with a focus on clean code and excellent user experience.`}
                  </p>
                </div>
              )} */}

              {isEditing ? (
                <div className="mt-6 space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentUser.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1 pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddSkill()
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentUser.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
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
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio Item
                </Button>
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
                      {
                      /* <CardContent className="p-6 pt-0">
                        <p className="text-muted-foreground">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mt-4">
                          {item.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent> */
                      }
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
              <h2 className="text-2xl font-bold">Reviews</h2>
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?text=JD" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">John Doe</CardTitle>
                          <p className="text-xs text-muted-foreground">May 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 5 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Alex did an amazing job on our website. The code is clean, well-documented, and the site loads
                      incredibly fast. Would definitely hire again!
                    </p>
                    <Separator className="my-4" />
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Freelancer's Response:</p>
                      <p className="text-sm text-muted-foreground">
                        Thank you for your kind words! It was a pleasure working with you on this project.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Services</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Service
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-6">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1">{service.title}</CardTitle>
                        <Badge>{service.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{service.averageRating || "New"}</span>
                          <span className="text-xs text-muted-foreground">({service.totalReviews})</span>
                        </div>
                        <p className="font-bold">
                          From {service.startingPrice} {service.currency}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <h2 className="text-2xl font-bold">Performance Stats</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2.45 ETH</div>
                    <p className="text-sm text-muted-foreground">Total earnings this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{currentUser.completedProjects}</div>
                    <p className="text-sm text-muted-foreground">Completed projects</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold flex items-center">
                      {currentUser.reputationScore}
                      <StarIcon className="h-6 w-6 text-yellow-500 fill-yellow-500 ml-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Project Completed</p>
                          <p className="text-sm text-muted-foreground">E-commerce Website Development</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">2 days ago</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <StarIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">New Review</p>
                          <p className="text-sm text-muted-foreground">5-star rating from John Doe</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
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
