"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, Clock, MessageCircle, CheckCircle, Calendar, Award, X } from "lucide-react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import {
  getServiceById,
  getFreelancerById,
  getReviewsForService,
  formatPrice,
  formatDate,
  services,
} from "@/lib/marketplace-data"
import { useParams } from "react-router-dom"

export default function ServicePage() {
  const { id } = useParams(); 
  if(!id){
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Service ID is required</p>
      </div>
    )
  }
  // Find the service by ID, or use the first service as a fallback
  const service = getServiceById(id) || services[0]
  const freelancer = getFreelancerById(service.freelancerId)
  const reviews = getReviewsForService(service.id)

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("standard")

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
                    <span className="text-foreground/70">({service.totalReviews} reviews)</span>
                  </div>
                  <Badge variant="secondary">{service.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-foreground/70" />
                    <span className="text-sm text-foreground/70">
                      {service.deliveryTimeMin} day{service.deliveryTimeMin > 1 ? "s" : ""} delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="aspect-video w-full overflow-hidden rounded-xl border">
                <img
                  src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
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
                      I specialize in providing high-quality {service.category.toLowerCase()} services tailored to your
                      specific needs. With over 5 years of experience in the field, I've helped hundreds of clients
                      achieve their goals. My approach is collaborative and client-focused. I'll work closely with you
                      to understand your requirements and deliver results that exceed your expectations. What you'll
                      get: - Professional {service.category.toLowerCase()} services - Fast turnaround times - Revisions
                      as specified in your package - Ongoing support after delivery I pride myself on clear
                      communication, attention to detail, and delivering on time, every time.
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6 space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review, i) => (
                      <div key={review.id} className="border-b pb-6 last:border-0">
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
                                    className={`h-4 w-4 ${j < review.rating ? "text-yellow-500 fill-yellow-500" : "text-foreground/40"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-foreground/70">{formatDate(review.createdAt)}</p>
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
                        Payment is processed through{" "}
                        {service.paymentMethod === "Escrow" ? "secure escrow" : "direct payment"} on the blockchain,
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
                  <Tabs defaultValue="standard" onValueChange={(value) => setSelectedPackage(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger value="basic" className="relative">
                            Basic
                            <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Entry-level service with essential features at an affordable price. Best for simple projects
                            and individuals.
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger value="standard" className="relative">
                            Standard
                            <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Our most popular package with a balanced mix of features and value. Perfect for most
                            clients.
                          </p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger value="premium" className="relative">
                            Premium
                            <HelpCircle className="h-3 w-3 ml-1 inline-block text-foreground/50" />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>
                            Premium service with all features, fastest delivery, and VIP support. Ideal for professional
                            and business needs.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TabsList>

                    {service.tiers.map((tier) => (
                      <TabsContent key={tier.id} value={tier.id} className="p-6 space-y-6">
                        <div>
                          <h3 className="text-xl font-bold">{tier.name}</h3>
                          <p className="text-foreground/70 mt-1">{tier.description}</p>
                        </div>

                        <div className="text-3xl font-bold">{formatPrice(tier.price, service.currency)}</div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-foreground/70" />
                            <span>
                              {tier.deliveryDays} day
                              {tier.deliveryDays > 1 ? "s" : ""} delivery
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-foreground/70" />
                            <span>
                              {tier.revisions} revision
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
                            {tier.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-highlight" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <Button className="w-full bg-highlight text-black hover:bg-highlight/90">Order Now</Button>
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
                  </Tabs>
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
                        <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{freelancer.fullName}</h3>
                        <p className="text-sm text-foreground/70">{freelancer.email.split("@")[0]}.eth</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm">{freelancer.reputationScore}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Calendar className="h-5 w-5 mb-1 text-foreground/70" />
                        <span className="text-sm font-medium">Member since</span>
                        <span className="text-xs text-foreground/70">Jan 2023</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Award className="h-5 w-5 mb-1 text-foreground/70" />
                        <span className="text-sm font-medium">Completed</span>
                        <span className="text-xs text-foreground/70">{freelancer.completedProjects} orders</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4 bg-highlight text-black hover:bg-highlight/90"
                      onClick={() => (window.location.href = `/profile/${freelancer.id}`)}
                    >
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Package Comparison */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Compare Packages</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="py-4 px-6 text-left">Feature</th>
                    {service.tiers.map((tier) => (
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
                    {service.tiers.map((tier) => (
                      <td key={tier.id} className="py-4 px-6 text-center">
                        {formatPrice(tier.price, service.currency)}
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
                    {service.tiers.map((tier) => (
                      <td key={tier.id} className="py-4 px-6 text-center">
                        {tier.deliveryDays} days
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
                    {service.tiers.map((tier) => (
                      <td key={tier.id} className="py-4 px-6 text-center">
                        {tier.revisions}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        Concepts/Drafts
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Number of initial design concepts or drafts you'll receive to choose from.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">1</td>
                    <td className="py-4 px-6 text-center font-bold">3</td>
                    <td className="py-4 px-6 text-center">5</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        Commercial Use
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rights to use the deliverables for commercial purposes.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <X className="h-5 w-5 mx-auto text-foreground/50" />
                    </td>
                    <td className="py-4 px-6 text-center font-bold">
                      <CheckCircle className="h-5 w-5 mx-auto text-highlight" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckCircle className="h-5 w-5 mx-auto text-highlight" />
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        Support
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-foreground/50 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Level of customer support provided after delivery.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">Basic</td>
                    <td className="py-4 px-6 text-center font-bold">Standard</td>
                    <td className="py-4 px-6 text-center">Premium (30 days)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6"></td>
                    {service.tiers.map((tier) => (
                      <td key={tier.id} className="py-4 px-6 text-center">
                        <Button
                          className="bg-highlight text-black hover:bg-highlight/90"
                          onClick={() => setSelectedPackage(tier.id as any)}
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
        </main>
      </TooltipProvider>
      {freelancer && (
        <ChatSidebar
          freelancerId={freelancer.id}
          freelancerName={freelancer.fullName}
          freelancerAvatar={freelancer.profilePictureUrl}
          serviceId={service.id}
          serviceName={service.title}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      <Footer />
    </div>
  )
}
