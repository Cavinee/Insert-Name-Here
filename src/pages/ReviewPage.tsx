"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Review_backend } from "@/declarations/Review_backend"
import { Principal } from "@dfinity/principal"

// Dummy functions and data (replace with your actual implementation)
const getOrderById = async (orderId: string) => ({
  id: orderId,
  serviceId: "aaaaa-aa",
  freelancerId: "bbbbb-bb",
  clientId: "client1",
  jobStatus: "Completed",
  isReviewed: false,
})

const getServiceById = (id: string) => ({
  id: id,
  title: "Sample Service",
  description: "This is a sample service",
  category: "Design",
  attachments: [{ imageUrl: "/placeholder.svg" }],
})

const getFreelancerById = (id: string) => ({
  id: id,
  fullName: "Freelancer Name",
  profilePictureUrl: "",
})

const getClientById = (id: string) => ({
  id: id,
  fullName: "Client Name",
})

export default function ReviewPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any>(null)
  const [service, setService] = useState<any>(null)
  const [freelancer, setFreelancer] = useState<any>(null)
  const [reviewer, setReviewer] = useState<any>(null)

  const currentUserId = "client1"

  useEffect(() => {
    if (!orderId) return

    const fetchData = async () => {
      const order = await getOrderById(orderId)
      const service = getServiceById(order.serviceId)
      const freelancer = getFreelancerById(order.freelancerId)
      const reviewer = getClientById(currentUserId)

      setOrder(order)
      setService(service)
      setFreelancer(freelancer)
      setReviewer(reviewer)

      if (order.clientId !== currentUserId) {
        setError("You can only review orders you've placed")
        return
      }

      if (order.jobStatus !== "Completed") {
        setError("You can only review completed orders")
        return
      }

      if (order.isReviewed) {
        setError("You have already reviewed this order")
        return
      }
    }

    fetchData()
  }, [orderId])

  const handleSubmitReview = async () => {
    if (!order || !service || !freelancer || !reviewer) {
      setError("Missing required information")
      return
    }

    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Rating required",
        description: "Please provide a rating before submitting your review.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const reviewParams = {
        orderId: Principal.fromText(order.id),
        serviceId: Principal.fromText(service.id),
        recipientId: Principal.fromText(freelancer.id),
        rating,
        comment,
        reviewType: "client-to-freelancer",
      }

      await Review_backend.addReview(reviewParams)

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      navigate("/orders")
    } catch (err) {
      console.error("Failed to submit review:", err)
      setError("Failed to submit review.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-6">
            <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order || !service || !freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-12">
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Leave a Review</h1>
          <p className="text-muted-foreground mb-8">Share your experience with this service</p>

          <Card>
            <CardHeader>
              <CardTitle>Review for Order #{order.id.substring(0, 8)}</CardTitle>
              <CardDescription>Service: {service.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
                      <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{freelancer.fullName}</span>
                    <Badge variant="outline">{service.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <StarRating rating={rating} onRatingChange={setRating} size={32} interactive={true} />
                </div>

                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Your Review
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Share details of your experience with this service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/orders")}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}