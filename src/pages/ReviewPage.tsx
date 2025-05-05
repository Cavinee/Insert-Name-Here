// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Navigation } from "../components/navigation"
// import { Footer } from "../components/footer"
// import { Button } from "../components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Textarea } from "@/components/ui/textarea"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { StarRating } from "@/components/star-rating"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { AlertCircle } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"
// import { Order_backend } from "@/declarations/Order_backend"

// export default function ReviewPage() {
//   const { orderId } = useParams<{ orderId: string }>()
//   const navigate = useNavigate()
//   const { toast } = useToast()

//   const [rating, setRating] = useState<number>(0)
//   const [comment, setComment] = useState<string>("")
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   // Assume the current user is the first client for demo purposes
//   const currentUserId = "client1"

//   // Get order details
//   const order = orderId ? Order_backend.getOrder(orderId) : null
//   const service = order ? getServiceById(order.serviceId) : null
//   const freelancer = order ? getFreelancerById(order.freelancerId) : null
//   const reviewer = getClientById(currentUserId)

//   useEffect(() => {
//     // Validate that this is a valid order that can be reviewed
//     if (!order) {
//       setError("Order not found")
//       return
//     }

//     if (order.clientId !== currentUserId) {
//       setError("You can only review orders you've placed")
//       return
//     }

//     if (order.jobStatus !== "Completed") {
//       setError("You can only review completed orders")
//       return
//     }

//     // Check if already reviewed
//     const alreadyReviewed = order.isReviewed
//     if (alreadyReviewed) {
//       setError("You have already reviewed this order")
//       return
//     }
//   }, [order, currentUserId])

//   const handleSubmitReview = () => {
//     if (!order || !service || !freelancer || !reviewer) {
//       setError("Missing required information")
//       return
//     }

//     if (rating === 0) {
//       toast({
//         variant: "destructive",
//         title: "Rating required",
//         description: "Please provide a rating before submitting your review.",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     // Create review object based on the interface
//     const review = {
//       id: `review-${Date.now()}`, // Generate a unique ID
//       orderId: order.id,
//       serviceId: service.id,
//       reviewerId: reviewer.id,
//       recipientId: freelancer.id,
//       rating: rating,
//       comment: comment,
//       createdAt: Date.now(),
//       freelancerResponse: null,
//       reviewType: "service", // Assuming this is a service review
//     }

//     // Simulate API call to submit review
//     setTimeout(() => {
//       setIsSubmitting(false)
//       toast({
//         title: "Review submitted",
//         description: "Thank you for your feedback!",
//       })
//       navigate("/orders")
//     }, 1500)
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navigation />
//         <main className="flex-1 container py-12">
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Error</AlertTitle>
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//           <div className="flex justify-center mt-6">
//             <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   if (!order || !service || !freelancer) {
//     return (
//       <div className="min-h-screen flex flex-col">
//         <Navigation />
//         <main className="flex-1 container py-12">
//           <div className="flex justify-center items-center h-full">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//           </div>
//         </main>
//         <Footer />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navigation />
//       <main className="flex-1 container py-12">
//         <div className="max-w-2xl mx-auto">
//           <h1 className="text-3xl font-bold mb-2">Leave a Review</h1>
//           <p className="text-muted-foreground mb-8">Share your experience with this service</p>

//           <Card>
//             <CardHeader>
//               <CardTitle>Review for Order #{order.id.substring(0, 8)}</CardTitle>
//               <CardDescription>Service: {service.title}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Service and Freelancer Info */}
//               <div className="flex gap-4 items-start">
//                 <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
//                   <img
//                     src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
//                     alt={service.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
//                       <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <span className="font-medium">{freelancer.fullName}</span>
//                     <Badge variant="outline">{service.category}</Badge>
//                   </div>
//                   <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {/* Rating */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium">Rating</label>
//                   <div>
//                     <StarRating rating={rating} onRatingChange={setRating} size={32} interactive={true} />
//                   </div>
//                 </div>

//                 {/* Comment */}
//                 <div className="space-y-2">
//                   <label htmlFor="comment" className="text-sm font-medium">
//                     Your Review
//                   </label>
//                   <Textarea
//                     id="comment"
//                     placeholder="Share details of your experience with this service..."
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                     rows={5}
//                   />
//                 </div>

//                 {/* Hidden fields that would be handled by the backend */}
//                 <div className="bg-muted/30 p-4 rounded-md">
//                   <p className="text-xs text-muted-foreground mb-2">Review Information (automatically included)</p>
//                   <div className="grid grid-cols-2 gap-2 text-xs">
//                     <div>
//                       <span className="font-medium">Order ID:</span> {order.id}
//                     </div>
//                     <div>
//                       <span className="font-medium">Service ID:</span> {service.id}
//                     </div>
//                     <div>
//                       <span className="font-medium">Reviewer ID:</span> {currentUserId}
//                     </div>
//                     <div>
//                       <span className="font-medium">Recipient ID:</span> {freelancer.id}
//                     </div>
//                     <div>
//                       <span className="font-medium">Review Type:</span> service
//                     </div>
//                     <div>
//                       <span className="font-medium">Created At:</span> {new Date().toISOString()}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-between">
//               <Button variant="outline" onClick={() => navigate("/orders")}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSubmitReview} disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">���</span>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit Review"
//                 )}
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
