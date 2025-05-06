"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
import { Service_backend } from "@/declarations/Service_backend" 
import { Image, Service } from "@/declarations/Service_backend/Service_backend.did"
import { Freelancer_backend } from "@/declarations/Freelancer_backend"
import { FreelancerProfile } from "@/declarations/Freelancer_backend/Freelancer_backend.did"
import { Client_backend } from "@/declarations/Client_backend"
import { ClientProfile } from "@/declarations/Client_backend/Client_backend.did"
import { Principal } from "@dfinity/principal"
import { Order_backend } from "@/declarations/Order_backend"
import { Order } from "@/declarations/Order_backend/Order_backend.did"

export default function ProfilePage() {
  // Get user ID from URL params
  const { id } = useParams<{ id?: string }>()
  const principal = id ? Principal.fromText(id) : undefined
  
  // State for profile data using actual interfaces
  const [isClient, setIsClient] = useState<boolean | null>(null)
  const [clientProfile, setClientProfile] = useState<ClientProfile | undefined>(undefined)
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | undefined>(undefined)
  
  // State for services and orders
  const [services, setServices] = useState<Service[]>([])
  const [boughtOrders, setBoughtOrders] = useState<Order[]>([])
  const [soldOrders, setSoldOrders] = useState<Order[]>([])
  const [serviceDetails, setServiceDetails] = useState<{[key: string]: Service}>({})
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [availability, setAvailability] = useState(true)
  
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper to get the active profile (either client or freelancer)
  const getActiveProfile = () => {
    return isClient ? clientProfile : freelancerProfile
  }
  function isImageArrayTuple(
    attachments: [] | [Array<unknown>]
  ): attachments is [Array<Image>] {
    return (
      attachments.length > 0 &&
      Array.isArray(attachments[0]) &&
      typeof attachments[0][0] === "object" &&
      attachments[0][0] !== null &&
      "imageUrl" in attachments[0][0]
    );
  }

  // Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!principal) {
        setIsLoading(false)
        return
      }
      
      try {
        // Try to fetch client profile first
        const fetchedClientProfile = await Client_backend.getUser(principal)
        
        if (fetchedClientProfile) {
          // User is a client
          setIsClient(true)
          const clientObj = Array.isArray(fetchedClientProfile) ? fetchedClientProfile[0] : fetchedClientProfile
          setClientProfile(clientObj)
          
          // Fetch client orders
          const clientOrders = await Order_backend.getExistingClientOrders(principal)
          if (clientOrders) {
            setBoughtOrders(Array.isArray(clientOrders) ? clientOrders : [clientOrders])
            
            // Fetch service details for each order
            const orderDetails: { [key: string]: Service } = {};

            if (Array.isArray(clientOrders)) {
              for (const order of clientOrders) {
                try {
                  const serviceDetailsArray = await Service_backend.getServiceSoldById(order.freelancerId);
                  if (Array.isArray(serviceDetailsArray) && serviceDetailsArray.length > 0) {
                    // Assuming only one service per ID — adjust if multiple
                    orderDetails[order.serviceId.toString()] = serviceDetailsArray[0];
                  }
                } catch (e) {
                  console.error("Error fetching service details:", e);
                }
              }
            }

            setServiceDetails(orderDetails);

          }
          
        } else {
          throw new Error("Not a client")
        }
      } catch (e) {
        console.log("Not a client, trying freelancer", e)
        
        try {
          // Try to fetch freelancer profile
          const fetchedFreelancerProfile = await Freelancer_backend.getFreelancerProfile(principal)
          
          if (fetchedFreelancerProfile) {
            // User is a freelancer
            setIsClient(false)
            setFreelancerProfile(Array.isArray(fetchedFreelancerProfile) ? fetchedFreelancerProfile[0] : fetchedFreelancerProfile)
            
            // Fetch freelancer services
            const freelancerServices = await Service_backend.getServiceSoldById(principal)
            if (freelancerServices) {
              setServices(Array.isArray(freelancerServices) ? freelancerServices : [freelancerServices])
            }
      
            // Fetch orders for services provided by freelancer
            const receivedOrders = await Order_backend.getOrdersForFreelancer(principal)
            if (receivedOrders) {
              setSoldOrders(Array.isArray(receivedOrders) ? receivedOrders : [receivedOrders])
            }
            
            // Fetch orders where freelancer is buying (as a client)
            const buyingOrders = await Order_backend.getExistingClientOrders(principal)
            if (buyingOrders) {
              setBoughtOrders(Array.isArray(buyingOrders) ? buyingOrders : [buyingOrders])
              
              // Fetch service details for each order
              const orderDetails: { [key: string]: Service } = {};

              if (Array.isArray(buyingOrders)) {
                for (const order of buyingOrders) {
                  try {
                    const serviceDetailsArray = await Service_backend.getServiceSoldById(order.freelancerId);
                    if (Array.isArray(serviceDetailsArray) && serviceDetailsArray.length > 0) {
                      // Assuming only one service per ID — adjust if multiple
                      orderDetails[order.serviceId.toString()] = serviceDetailsArray[0];
                    }
                  } catch (e) {
                    console.error("Error fetching service details:", e);
                  }
                }
              }

              setServiceDetails(orderDetails);
            }
          } else {
            toast({
              variant: "destructive",
              title: "User not found",
              description: "Could not find user profile",
            })
          }
        } catch (err) {
          console.error("Error fetching profile:", err)
          toast({
            variant: "destructive",
            title: "Error loading profile",
            description: "Could not load user profile data.",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUser()
  }, [principal, toast])

  // Handle edit toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false)
      handleSaveProfile()
    } else {
      setIsEditing(true)
    }
  }

  // Handle profile save
  const handleSaveProfile = async () => {
    setIsLoading(true)
    const activeProfile = getActiveProfile()
    // Validate form
    if (!activeProfile?.fullName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty",
      })
      setIsLoading(false)
      return
    }

    if (!activeProfile?.email?.trim() || !activeProfile.email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid email address",
      })
      setIsLoading(false)
      return
    }

    try {
      // Save the profile to backend based on user type
      if (principal) {
        if (isClient && clientProfile) {
          await Client_backend.updateUser(clientProfile)
        } else if (!isClient && freelancerProfile) {
          await Freelancer_backend.updateFreelancerProfile(freelancerProfile)
        }
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: "There was a problem updating your profile.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle skill management - only for freelancers
  const handleAddSkill = () => {
    if (!newSkill.trim() || isClient) return;
    
    if (!isClient && freelancerProfile) {
      setFreelancerProfile({
        ...freelancerProfile,
        skills: [...freelancerProfile.skills, newSkill.trim()]
      });
    }
    
    setNewSkill("");
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!isClient && freelancerProfile) {
      setFreelancerProfile({
        ...freelancerProfile,
        skills: freelancerProfile.skills.filter((skill) => skill !== skillToRemove)
      });
    }
  }

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // In a real implementation, you'd upload to a storage service
      // and get back a URL. For now, we'll simulate this.
      const imageUrl = URL.createObjectURL(file);
      
      // Update the appropriate profile state
      if (isClient && clientProfile) {
        setClientProfile({
          ...clientProfile,
          profilePictureUrl: imageUrl
        });
      } else if (!isClient && freelancerProfile) {
        setFreelancerProfile({
          ...freelancerProfile,
          profilePictureUrl: imageUrl
        });
      }
      
      toast({
        title: "Image ready",
        description: "Image will be updated when you save your profile.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error uploading image",
        description: "Could not upload profile image.",
      });
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  // Helper to update profile field
  const updateProfileField = (field: string, value: any) => {
    if (isClient && clientProfile) {
      setClientProfile({
        ...clientProfile,
        [field]: value
      });
    } else if (!isClient && freelancerProfile) {
      setFreelancerProfile({
        ...freelancerProfile,
        [field]: value
      });
    }
  }

  // Get service title for an order
  const getServiceTitle = (serviceId: string) => {
    if (serviceDetails[serviceId]) {
      return serviceDetails[serviceId].title;
    }
    return "Service Order";
  }
  
  // Get service price for an order
  const getServicePrice = (serviceId: string) => {
    if (serviceDetails[serviceId]) {
      return serviceDetails[serviceId].tiers[0]?.price || 0;
    }
    return 0;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <span className="animate-spin text-4xl mr-2">⟳</span>
        <p>Loading profile...</p>
      </div>
    )
  }

  // Get active profile for rendering
  const activeProfile = getActiveProfile();

  // No user found state
  if (!activeProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>User Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We couldn't find this user profile. The user may not exist or you may not have permission to view it.</p>
              <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={activeProfile.profilePictureUrl || "/placeholder.svg"} />
                <AvatarFallback>{activeProfile.fullName.charAt(0)}</AvatarFallback>
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
                        value={activeProfile.fullName}
                        onChange={(e) => updateProfileField('fullName', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold">{activeProfile.fullName}</h1>
                  )}

                  {isEditing && !isClient && freelancerProfile ? (
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Web Developer, UI Designer"
                        defaultValue={freelancerProfile?.skills?.length > 0 ? `${freelancerProfile.skills[0]} Specialist` : "Professional"}
                      />
                    </div>
                  ) : (
                    <p className="text-xl text-highlight font-medium">
                      {!isClient && freelancerProfile  && freelancerProfile?.skills?.length > 0 
                        ? `${freelancerProfile.skills[0]} Specialist` 
                        : (isClient ? "Client" : "Freelancer")}
                    </p>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={activeProfile.email}
                        onChange={(e) => updateProfileField('email', e.target.value)}
                        placeholder="Your email address"
                      />
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{activeProfile.email}</p>
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

              {!isClient && !isEditing && freelancerProfile && (
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{freelancerProfile.reputationScore.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>{Number(freelancerProfile.completedProjects)} Completed Projects</span>
                  </div>
                </div>
              )}

              {isEditing && !isClient && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="availability">Available for work</Label>
                    <Switch id="availability" checked={availability} onCheckedChange={setAvailability} />
                  </div>
                </div>
              )}

              {/* Only show skills section for freelancers */}
              {isEditing && !isClient && freelancerProfile ? (
                <div className="mt-6 space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {freelancerProfile.skills.map((skill) => (
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
              ) : (!isClient && freelancerProfile && freelancerProfile.skills.length > 0) ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {freelancerProfile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <Tabs defaultValue={isClient ? "orders" : "services"}>
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              {!isClient && <TabsTrigger value="services">My Services</TabsTrigger>}
              <TabsTrigger value="orders">My Orders</TabsTrigger>
              {!isClient && <TabsTrigger value="received-orders">Received Orders</TabsTrigger>}
            </TabsList>

            {!isClient && (
              <TabsContent value="services" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">My Services</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Service
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <Card key={service.id.toString() || `service-${Math.random()}`} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          {service.attachments && service.attachments.length > 0 ? (
                            <img
                              src={isImageArrayTuple(service.attachments)
                              ? service.attachments[0][0].imageUrl
                              : "/placeholder.svg"}
                              alt={service.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                              No Image Available
                            </div>
                          )}
                        </div>
                        <CardHeader className="p-6">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg line-clamp-1">{service.title}</CardTitle>
                            {service.category && <Badge>{service.category}</Badge>}
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm">{service.averageRating || "New"}</span>
                              <span className="text-xs text-muted-foreground">({Number(service.totalReviews) || 0})</span>
                            </div>
                            <p className="font-bold">
                              {Number(service.tiers[0].price)} {service.currency || "ETH"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-muted-foreground">No services listed yet. Create your first service!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-2xl font-bold">My Orders</h2>
              
              {boughtOrders.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {boughtOrders.map((order) => (
                    <Card key={order.id.toString() || `order-${Math.random()}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{getServiceTitle((order.serviceId).toString())}</CardTitle>
                          <Badge variant={getOrderStatusBadge(order.jobStatus || "Pending")}>{order.jobStatus || "Pending"}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <span>{formatDate(order.createdAt.toLocaleString() || Date.now())}</span>
                          </div>

                          <div className="text-right">
                            <p className="font-bold">{getServicePrice(order.serviceId).toLocaleString()} {order.currency || "ETH"}</p>
                            {order.jobStatus === "Pending" && (
                              <Button size="sm" className="mt-2">Contact Seller</Button>
                            )}
                            {order.jobStatus === "Completed" && (
                              <Button size="sm" className="mt-2">Leave Review</Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't ordered any services yet.</p>
                  <Button className="mt-4">Browse Services</Button>
                </div>
              )}
            </TabsContent>

            {!isClient && (
              <TabsContent value="received-orders" className="space-y-6">
                <h2 className="text-2xl font-bold">Received Orders</h2>
                
                {soldOrders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {soldOrders.map((order) => (
                      <Card key={order.id.toString() || `received-${Math.random()}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{getServiceTitle(order.serviceId)}</CardTitle>
                            <Badge variant={getOrderStatusBadge(order.jobStatus || "Pending")}>{order.jobStatus || "Pending"}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              <span>{formatDate(order.createdAt.toLocaleString() || Date.now())}</span>
                            </div>

                            <div className="text-right">
                              <p className="font-bold">{getServicePrice(order.serviceId).toLocaleString()} {order.currency || "ETH"}</p>
                              {order.jobStatus === "Pending" && (
                                <div className="flex gap-2 justify-end mt-2">
                                  <Button size="sm" variant="destructive">Decline</Button>
                                  <Button size="sm">Accept</Button>
                                </div>
                              )}
                              {order.jobStatus === "In Progress" && (
                                <Button size="sm" className="mt-2">Complete Order</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">You haven't received any orders yet.</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Helper functions
function formatDate(timestamp: number | string | undefined): string {
  if (!timestamp) return "N/A"
  
  try {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  } catch (e) {
    return "Invalid date"
  }
}

  function getOrderStatusBadge(
    status: string
  ): "default" | "secondary" | "destructive" | "outline" | null {
    switch (status.toLowerCase()) {
      case "completed":
        return "default"; // or "outline"
      case "in progress":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }

}