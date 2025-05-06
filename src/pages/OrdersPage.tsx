"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Clock, CheckCircle, AlertCircle, MessageCircle, Star, Loader2 } from "lucide-react"
import { ChatSidebar } from "../components/chat-sidebar"
import { formatDate } from "../lib/marketplace-data"
import { backend } from "@/utility/backend"
import { Order_backend } from "@/declarations/Order_backend"
import { Client_backend } from "@/declarations/Client_backend"
import { Service_backend } from "@/declarations/Service_backend"
import { Freelancer_backend } from "@/declarations/Freelancer_backend"
import { useToast } from "@/components/ui/use-toast"
import { Principal } from "@dfinity/principal"
import { Order } from "@/declarations/Order_backend/Order_backend.did"
import { Service } from "@/declarations/Service_backend/Service_backend.did"
import { FreelancerProfile } from "@/declarations/Freelancer_backend/Freelancer_backend.did"
import { ClientProfile } from "@/declarations/Client_backend/Client_backend.did" // Added import for ClientProfile

export default function OrdersPage() {
  const { id } = useParams<{ id: string }>();
  if(!id) return null;
  let principalId = Principal.fromText(id)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeChat, setActiveChat] = useState<{
    id: string
    name: string
    service: string
  } | null>(null)
  
  const [hasProfile, checkHasProfile] = useState<boolean>(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [buyingOrders, setBuyingOrders] = useState<Order[]>([])
  const [sellingOrders, setSellingOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [serviceCache, setServiceCache] = useState<Record<string, Service>>({})

  // Load user data and orders
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Get current user ID
        checkHasProfile(await backend.hasProfile(principalId)) 
        if (!hasProfile) {
          toast({
            title: "Authentication Error",
            description: "Please log in to view your orders.",
            variant: "destructive"
          })
          navigate("/login")
          return
        }
        
        // Get user role
        const role = await Client_backend.getRole(principalId)
        setUserRole(role)
        
        // Fetch buying orders
        const clientOrders = await Order_backend.getExistingClientOrders(principalId)
        setBuyingOrders(clientOrders)
        
        // Fetch selling orders if user is a freelancer
        if (role === "Freelancer") {
          const freelancerOrders = await Order_backend.getOrdersForFreelancer(principalId)
          setSellingOrders(freelancerOrders)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again later.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [navigate, toast])

  // Helper function to get service details
  const getServiceDetails = async (serviceId: string): Promise<Service | null> => {
    if (serviceCache[serviceId]) {
      return serviceCache[serviceId]
    }
    
    try {
      const result = await Service_backend.getServiceDetails(serviceId)
      if (result && result.length > 0) {
        const service = result[0]
        if(service){
          setServiceCache(prev => ({ ...prev, [serviceId]: service }))
          return service

        }
      }
    } catch (error) {
      console.error(`Error fetching service ${serviceId}:`, error)
    }
    return null
  }
  
  // Helper function to get user details (client or freelancer)
  const getUserDetails = async (userId: Principal, isFreelancer: boolean): Promise<FreelancerProfile | ClientProfile | null> => {
    try {
      if (isFreelancer) {
        const user = await Freelancer_backend.getFreelancerProfile(userId)
        if(!user) return null
        const userObj = Array.isArray(user) ? user[0] ?? null : user
        return userObj
      } else {
        const user =  await Client_backend.getUser(userId)
        if(!user) return null
        const userObj = Array.isArray(user) ? user[0] ?? null : user
        return userObj
      }
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error)
      return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "InProgress":
        return <Badge className="bg-info text-info-foreground">Active</Badge>
      case "Completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-destructive text-destructive-foreground">Cancelled</Badge>
      case "Disputed":
        return <Badge className="bg-warning text-warning-foreground">Disputed</Badge>
      case "Delivered":
        return <Badge className="bg-primary text-primary-foreground">Delivered</Badge>
      default:
        return <Badge>{status || "Unknown"}</Badge>
    }
  }

  const handleOpenChat = async (order: Order) => {
    try {
      if (!principalId) return;
      
      const isClientOrder = order.clientId.toString() === principalId.toString()
      
      const counterparty = await getUserDetails(
        isClientOrder ? order.freelancerId : order.clientId,
        isClientOrder // If this is client's order, get freelancer details
      )
      
      const service = await getServiceDetails(order.serviceId)
      
      if (counterparty && service) {
        setActiveChat({
          id: order.id,
          name: counterparty.fullName || "Unknown",
          service: service.title,
        })
      }
    } catch (error) {
      console.error("Error opening chat:", error)
      toast({
        title: "Error",
        description: "Could not open the chat. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleLeaveReview = (orderId: string) => {
    navigate(`/review/${orderId}`)
  }
  
  //Helper function to format date values (handles both Date objects and BigInt)
  const formatDateSafely = (dateValue: any): string => {
    if (!dateValue) return "N/A"
    
    try {
      // If it's a BigInt, convert to number
      // if (typeof dateValue === 'bigint') {
      //   return formatDate(Number(dateValue))
      // }
      
      // If it's already a date or timestamp
      return formatDate(dateValue)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }
  
  // Helper function to get package price
  const getPackagePrice = (service: Service | null, packageId: string, currency: string): string => {
    if (!service || !service.tiers) return `0.00 ${currency}`
    
    try {
      const tier = service.tiers.find((t: any) => t.id === packageId)
      if (tier) {
        const price = typeof tier.price === 'bigint' ? Number(tier.price) : tier.price
        return `${price.toFixed(2)} ${currency}`
      }
    } catch (error) {
      console.error("Error calculating price:", error)
    }
    
    return `0.00 ${currency}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your orders...</p>
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
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">Manage your orders and track their progress</p>

        <Tabs defaultValue="buying">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="buying">Orders I'm Buying</TabsTrigger>
            <TabsTrigger value="selling">Orders I'm Selling</TabsTrigger>
          </TabsList>

          <TabsContent value="buying" className="space-y-6">
            {buyingOrders.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <p className="text-lg text-muted-foreground">You don't have any orders yet.</p>
                <Button className="mt-4" onClick={() => navigate("/services")}>Browse Services</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {buyingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userId={principalId}
                    getServiceDetails={getServiceDetails}
                    getUserDetails={getUserDetails}
                    getStatusBadge={getStatusBadge}
                    formatDateSafely={formatDateSafely}
                    getPackagePrice={getPackagePrice}
                    handleOpenChat={handleOpenChat}
                    handleLeaveReview={handleLeaveReview}
                    isBuying={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="selling" className="space-y-6">
            {sellingOrders.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <p className="text-lg text-muted-foreground">You don't have any orders to fulfill yet.</p>
                {userRole === "Freelancer" && (
                  <Button className="mt-4" onClick={() => navigate(`/create`)}>View Dashboard</Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userId={principalId}
                    getServiceDetails={getServiceDetails}
                    getUserDetails={getUserDetails}
                    getStatusBadge={getStatusBadge}
                    formatDateSafely={formatDateSafely}
                    getPackagePrice={getPackagePrice}
                    handleOpenChat={handleOpenChat}
                    handleLeaveReview={handleLeaveReview}
                    isBuying={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {activeChat && (
        <ChatSidebar
          freelancerId={activeChat.id}
          freelancerName={activeChat.name}
          freelancerAvatar={`/placeholder.svg?text=${activeChat.name.charAt(0)}`}
          serviceId={activeChat.id}
          serviceName={activeChat.service}
          isOpen={!!activeChat}
          onClose={() => setActiveChat(null)}
        />
      )}

      <Footer />
    </div>
  )
}

// Add proper TypeScript interfaces for OrderCard props
interface OrderCardProps {
  order: Order;
  userId: Principal | null;
  getServiceDetails: (serviceId: string) => Promise<Service | null>;
  getUserDetails: (userId: Principal, isFreelancer: boolean) => Promise<FreelancerProfile | ClientProfile | null>;
  getStatusBadge: (status: string) => JSX.Element;
  formatDateSafely: (dateValue: any) => string;
  getPackagePrice: (service: Service | null, packageId: string, currency: string) => string;
  handleOpenChat: (order: Order) => Promise<void>;
  handleLeaveReview: (orderId: string) => void;
  isBuying: boolean;
}

// Helper component to render order cards
function OrderCard({ 
  order, 
  userId,
  getServiceDetails, 
  getUserDetails, 
  getStatusBadge, 
  formatDateSafely, 
  getPackagePrice,
  handleOpenChat, 
  handleLeaveReview,
  isBuying 
}: OrderCardProps) {
  const [service, setService] = useState<Service | null>(null)
  const [counterparty, setCounterparty] = useState<FreelancerProfile | ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      try {
        // Get service details
        const serviceData = await getServiceDetails(order.serviceId)
        setService(serviceData)
        
        // Get user details (client or freelancer)
        const counterpartyId = isBuying ? order.freelancerId : order.clientId
        const counterpartyData = await getUserDetails(counterpartyId, isBuying)
        setCounterparty(counterpartyData)
      } catch (error) {
        console.error("Error loading order data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [order.id, order.serviceId, order.freelancerId, order.clientId, getServiceDetails, getUserDetails, isBuying])
  
  if (loading || !service || !counterparty) {
    return (
      <Card className="overflow-hidden opacity-70">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="animate-pulse">
              <div className="h-5 w-40 bg-muted rounded"></div>
              <div className="h-4 w-24 bg-muted rounded mt-2"></div>
            </div>
            <div className="h-6 w-20 bg-muted rounded"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex animate-pulse">
            <div className="h-8 w-8 bg-muted rounded-full"></div>
            <div className="ml-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-16 bg-muted rounded mt-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Order #{typeof order.id === 'string' ? order.id.substring(0, 8) : 'Unknown'}
            </p>
          </div>
          {getStatusBadge(order.jobStatus)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={counterparty.profilePictureUrl || "/placeholder.svg"} />
              <AvatarFallback>{(counterparty.fullName || "?").charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{counterparty.fullName || "Unknown"}</p>
              {counterparty.email && (
                <p className="text-xs text-muted-foreground">
                  {counterparty.email.split("@")[0]}.eth
                </p>
              )}
            </div>
          </div>
          <p className="font-bold">
            {getPackagePrice(service, order.packageId, order.currency)}
          </p>
        </div>

        {/* {<div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Due: {formatDateSafely(order.deliveryDeadline)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Ordered on {formatDateSafely(order.createdAt)}
          </span>
        </div>} */}

        <div className="flex justify-between pt-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenChat(order)}>
            <MessageCircle className="h-4 w-4 mr-1" />
            Message
          </Button>
          
          {/* Buyer buttons */}
          {isBuying && (
            <>
              {order.orderStatus === "Undecided" && (
                <Button size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Order Pending
                </Button>
              )}
              {order.orderStatus === "Rejected" && (
                <Button size="sm" disabled>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Order Rejected
                </Button>
              )}
              {order.orderStatus === "Accepted" && (
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Processing Order
                </Button>
              )}
              {order.jobStatus === "InProgress" && (
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Processing Order
                </Button>
              )}
              {order.jobStatus === "Disputed" && (
                <Button size="sm" variant="destructive">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Request Revision
                </Button>
              )}
              {order.jobStatus === "Completed" && (
                <Button size="sm" variant="secondary" onClick={() => handleLeaveReview(order.id)}>
                  <Star className="h-4 w-4 mr-1" />
                  Leave Review
                </Button>
              )}
            </>
          )}
          
          {/* Seller buttons */}
          {!isBuying && (
            <>
              {order.jobStatus === "InProgress" && (
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Deliver Work
                </Button>
              )}
              {order.orderStatus === "Undecided" && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Reject</Button>
                  <Button size="sm">Accept</Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}