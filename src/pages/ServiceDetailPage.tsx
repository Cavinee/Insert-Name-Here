"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, Clock, MessageCircle, CheckCircle, Calendar, Award, X, AlertTriangle } from "lucide-react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import {
  formatPrice,
  formatDate,
  services,
} from "@/lib/marketplace-data"
import { useParams } from "react-router-dom"
import { Service_backend } from "@/declarations/Service_backend"
import { Freelancer_backend } from "@/declarations/Freelancer_backend"
import { Review_backend } from "@/declarations/Review_backend"
import { Principal } from "@dfinity/principal"
import { Image, Service, ServiceTier } from "@/declarations/Service_backend/Service_backend.did"
import { FreelancerProfile } from "@/declarations/Freelancer_backend/Freelancer_backend.did"
import { Review } from "@/declarations/Review_backend/Review_backend.did"

export default function ServicePage() {
  const { id } = useParams(); 
  const navigate = useNavigate()
  // Fixed the typing for useState hooks
  const [service, setService] = useState<Service | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("standard")
  function formatAttachments(attachments: [] | [Array<unknown>]): [Array<Image>] | [] {
    if (
      attachments.length > 0 &&
      Array.isArray(attachments[0]) &&
      attachments[0].length > 0 &&
      typeof attachments[0][0] === "object" &&
      attachments[0][0] !== null &&
      "imageUrl" in attachments[0][0] &&
      "imageTag" in attachments[0][0]
    ) {
      return attachments as [Array<Image>];
    }
    return [];
  }
  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("Service ID is required")
        setLoading(false)
        return
      }

      try {

        // Fetch service details
        const serviceData = await Service_backend.getServiceDetails(id)
        if (!serviceData) {
          throw new Error("Service not found")
        }

        // Handles both Service and [Service] (1-element tuple)
        const serviceObj: Service | null =
          Array.isArray(serviceData)
            ? (serviceData[0] ?? null)
            : (serviceData ?? null);

        setService(serviceObj ? {
          ...serviceObj,
          attachments: formatAttachments(serviceObj.attachments),
        } : null);

        if (!serviceObj) {
          throw new Error("Invalid service data")
        }
        
        // const freelancerData = await Freelancer_backend.getFreelancerProfile(serviceObj.freelancerId)

        // const freelancerObj: FreelancerProfile | null =
        //   Array.isArray(freelancerData)
        //     ? (freelancerData[0] ?? null)
        //     : (freelancerData ?? null);

        // if (!freelancerObj) {
        //   throw new Error("Invalid freelancer data");
        // }

        // setFreelancer(freelancerObj);
        
        // Fetch reviews with proper type safety
        if ('id' in serviceObj) {
          // const reviewsData = await Review_backend.getReviews(
          //   [serviceObj.id],   // serviceId as optional (?Principal)
          //   [],                // recipientId: none
          //   [],                // minRating: none
          //   []                 // limit: none
          // );
        
          // if (Array.isArray(reviewsData)) {
          //   setReviews(reviewsData);
          // }
        }
        
        // Set default selected package based on available tiers
        if (serviceObj.tiers && Array.isArray(serviceObj.tiers) && serviceObj.tiers.length > 0) {
          // If standard tier exists, select it by default, otherwise select the first available tier
          const standardTier = serviceObj.tiers.find(tier => tier.id === "standard")
          setSelectedPackage(standardTier ? "standard" : serviceObj.tiers[0].id)
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(`Failed to load service: ${err.message}`)
        
        // Fallback to static data for development purposes
        // Remove this in production
        if (services) {
          setService(service)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleOrderClick = () => {
    // Type guard to ensure service exists and has an id
    if (service && 'id' in service) {
      // Handle order logic here
      // Redirect to order page or show confirmation
      navigate(`/order-summary/${service.id}`, {
        state: { selectedPackage },
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading service information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>{error}</p>
      </div>
    )
  }

  // Check if service exists
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Service not found</p>
      </div>
    )
  }

  // Ensure tiers exist and handle empty case
  const tiers = service.tiers && Array.isArray(service.tiers) ? service.tiers : []
  const hasTiers = tiers.length >= 0
  
  // Create a map of available tier IDs for quick lookup
  const availableTierIds = new Set(tiers.map(tier => tier.id))
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
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      <TooltipProvider>
        <main className="flex-1 container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{service.averageRating || "New"}</span>
                    <span className="text-foreground/70">({(service.totalReviews).toLocaleString() || 0} reviews)</span>
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-foreground/70" />
                    <span className="text-sm text-foreground/70">
                      {service.tiers[0].deliveryDays.toLocaleString()} day{service.tiers[0].deliveryDays > 1 ? "s" : ""} delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-xl border">
                <img
                  src={ isImageArrayTuple(service.attachments)
                    ? service.attachments[0][0].imageUrl
                    : "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6 space-y-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-lg">{service.description}</p>
                    <div className="whitespace-pre-line mt-4">
                      I specialize in providing high-quality {service.category?.toLowerCase() || 'professional'} services tailored to your
                      specific needs. With over 5 years of experience in the field, I've helped hundreds of clients
                      achieve their goals. My approach is collaborative and client-focused. I'll work closely with you
                      to understand your requirements and deliver results that exceed your expectations. What you'll
                      get: - Professional {service.category?.toLowerCase() || 'professional'} services - Fast turnaround times - Revisions
                      as specified in your package - Ongoing support after delivery I pride myself on clear
                      communication, attention to detail, and delivering on time, every time.
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6 space-y-6">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review, i) => (
                      <div key={review.id?.toString() || i} className="border-b pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?text=User${i + 1}`} />
                            <AvatarFallback>U{i + 1}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">Client{i + 1}.eth</h4>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <StarIcon
                                    key={j}
                                    className={`h-4 w-4 ${j < (review.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-foreground/40"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-2">{review.comment}</p>
                            {review.freelancerResponse && (
                              <div className="mt-3 pl-4 border-l-2 border-white/20">
                                <p className="text-sm font-medium">Freelancer response:</p>
                                <p className="text-sm text-foreground/70">{review.freelancerResponse}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-foreground/70">No reviews yet. Be the first to review this service!</p>
                  )}
                </TabsContent>
                <TabsContent value="faq" className="mt-6 space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">What is your revision policy?</h3>
                      <p className="text-foreground/70 mt-1">
                        I offer revisions as specified in each package to ensure you're completely satisfied with the
                        final result.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">How do you handle payment?</h3>
                      <p className="text-foreground/70 mt-1">
                        Payment is processed through
                        Escrow on the blockchain,
                        ensuring security and transparency.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">What information do you need to get started?</h3>
                      <p className="text-foreground/70 mt-1">
                        I'll need a detailed brief outlining your requirements, preferences, and any reference materials
                        that might be helpful.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Service Order Card and Freelancer Info */}
            <div className="space-y-6">
              {/* Service Packages */}
              <Card className="bg-card text-foreground">
                <CardHeader>
                  <CardTitle>Choose a Package</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {!hasTiers ? (
                    <div className="p-6 text-center">
                      <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                      <p>No packages available for this service.</p>
                    </div>
                  ) : (
                    <Tabs defaultValue={selectedPackage} onValueChange={(value) => setSelectedPackage(value)}>
                      <TabsList className="grid w-full grid-cols-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger 
                              value="basic" 
                              className="relative"
                              disabled={!availableTierIds.has("basic")}
                            >
                              Basic
                              <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {availableTierIds.has("basic") ? (
                              <p>Entry-level service with essential features at an affordable price. Best for simple projects and individuals.</p>
                            ) : (
                              <p>This package is not currently provided by the freelancer.</p>
                            )}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger 
                              value="standard" 
                              className="relative"
                              disabled={!availableTierIds.has("standard")}
                            >
                              Standard
                              <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {availableTierIds.has("standard") ? (
                              <p>Our most popular package with a balanced mix of features and value. Perfect for most clients.</p>
                            ) : (
                              <p>This package is not currently provided by the freelancer.</p>
                            )}
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger 
                              value="premium" 
                              className="relative"
                              disabled={!availableTierIds.has("premium")}
                            >
                              Premium
                              <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            {availableTierIds.has("premium") ? (
                              <p>Premium service with all features, fastest delivery, and VIP support. Ideal for professional and business needs.</p>
                            ) : (
                              <p>This package is not currently provided by the freelancer.</p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TabsList>

                      {tiers.map((tier: ServiceTier) => (
                        <TabsContent key={tier.id} value={tier.id} className="p-6 space-y-6">
                          <div>
                            <h3 className="text-xl font-bold">{tier.name}</h3>
                            <p className="text-foreground/70 mt-1">{tier.description}</p>
                          </div>

                          <div className="text-3xl font-bold">{formatPrice(Number(tier.price), service.currency)}</div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-foreground/70" />
                              <span>
                                {Number(tier.deliveryDays)} day
                                {tier.deliveryDays > 1 ? "s" : ""} delivery
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-foreground/70" />
                              <span>
                                {Number(tier.revisions)} revision
                                {tier.revisions > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <h4 className="font-medium">What's included:</h4>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>All the features and services included in this package.</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <ul className="space-y-2">
                              {tier.features && tier.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-highlight" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-4">
                            <Button className="w-full bg-highlight text-black hover:bg-highlight/90" onClick={handleOrderClick}>
                              Order Now
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full border-highlight text-highlight hover:bg-highlight/10"
                              onClick={() => setIsChatOpen(!isChatOpen)}
                            >
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Contact Freelancer
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                      
                      {/* Placeholder content for unavailable tiers */}
                      {["basic", "standard", "premium"].map(tierId => {
                        if (!availableTierIds.has(tierId)) {
                          return (
                            <TabsContent key={tierId} value={tierId} className="p-6 text-center">
                              <div className="py-12">
                                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Package Not Available</h3>
                                <p className="text-foreground/70">
                                  This package is not currently provided by the freelancer.
                                </p>
                              </div>
                            </TabsContent>
                          )
                        }
                        return null
                      })}
                    </Tabs>
                  )}
                </CardContent>
              </Card>

              {/* About the Freelancer - Sticky Card */}
              {freelancer && (
                <Card className="bg-card text-foreground sticky top-24">
                  <CardHeader>
                    <CardTitle>About the Freelancer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback>{freelancer.fullName?.charAt(0) || 'F'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{freelancer.fullName}</h3>
                        <p className="text-sm text-foreground/70">{(freelancer.email?.split("@")[0] || freelancer.id).toString()}.eth</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{freelancer.reputationScore || "New"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                      
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Award className="h-5 w-5 mb-1 text-foreground/70" />
                        <span className="text-sm font-medium">Completed</span>
                        <span className="text-xs text-foreground/70">{Number(freelancer.completedProjects) || 0} orders</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-highlight text-black hover:bg-highlight/90"
                      onClick={() => {
                        if (freelancer && 'id' in freelancer) {
                          window.location.href = `/profile/${freelancer.id}`
                        }
                      }}
                    >
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Package Comparison */}
          {hasTiers && tiers.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Compare Packages</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-4 px-6 text-left">Feature</th>
                      {tiers.map((tier) => (
                        <th key={tier.id} className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {tier.name}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{tier.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-6">Price</td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="py-4 px-6 text-center">
                          {formatPrice(Number(tier.price), service.currency)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          Delivery Time
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                The estimated time to complete and deliver your project. Premium packages get priority
                                treatment.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="py-4 px-6 text-center">
                          {Number(tier.deliveryDays)} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          Revisions
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Number of times you can request changes to the delivered work.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="py-4 px-6 text-center">
                          {Number(tier.revisions)}
                        </td>
                      ))}
                    </tr>
                    {/* Dynamic comparison of other features based on available tiers */}
                    {tiers.length > 0 && tiers[0]?.features && Array.isArray(tiers[0].features) && tiers[0].features.map((_, featureIndex) => {
                      const featureName = tiers.some(tier => tier.features && Array.isArray(tier.features) && tier.features[featureIndex]) 
                        ? tiers.find(tier => tier.features && Array.isArray(tier.features) && tier.features[featureIndex])?.features?.[featureIndex]
                        : `Feature ${featureIndex + 1}`;
                        
                      return (
                        <tr key={featureIndex} className="border-b border-white/10">
                          <td className="py-4 px-6">{featureName}</td>
                          {tiers.map((tier) => (
                            <td key={tier.id} className="py-4 px-6 text-center">
                              {tier.features && Array.isArray(tier.features) && tier.features[featureIndex] ? (
                                <CheckCircle className="h-5 w-5 mx-auto text-highlight" />
                              ) : (
                                <X className="h-5 w-5 mx-auto text-foreground/50" />
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="py-4 px-6"></td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="py-4 px-6 text-center">
                          <Button
                            className="bg-highlight text-black hover:bg-highlight/90"
                            onClick={() => setSelectedPackage(tier.id)}
                          >
                            Select
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </TooltipProvider>
      {/* {freelancer && service && (
        <ChatSidebar
          freelancerId={freelancer.id}
          freelancerName={freelancer.fullName || 'Freelancer'}
          freelancerAvatar={freelancer.profilePictureUrl}
          serviceId={service.id}
          serviceName={service.title}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )} */}

      <Footer />
    </div>
  )
}