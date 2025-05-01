"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, CheckCircle, AlertCircle, MessageCircle } from "lucide-react"
import { ChatSidebar } from "@/components/chat-sidebar"
import { orders, clients, getClientById, getFreelancerById, getServiceById, formatDate } from "@/lib/marketplace-data"

export default function OrdersPage() {
  const [activeChat, setActiveChat] = useState<{
    id: string
    name: string
    service: string
  } | null>(null)

  // Assume the current user is the first client for demo purposes
  const currentUser = clients[0]

  // Filter orders for buying (where current user is client) and selling (where current user is freelancer)
  const buyingOrders = orders.filter((order) => order.clientId === currentUser.id)
  const sellingOrders = orders.filter((order) => order.freelancerId === currentUser.id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "InProgress":
        return <Badge className="bg-blue-500">Active</Badge>
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "Cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "Disputed":
        return <Badge className="bg-yellow-500">Disputed</Badge>
      case "Delivered":
        return <Badge className="bg-purple-500">Delivered</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const handleOpenChat = (order: any) => {
    const counterparty =
      order.clientId === currentUser.id ? getFreelancerById(order.freelancerId) : getClientById(order.clientId)

    const service = getServiceById(order.serviceId)

    if (counterparty && service) {
      setActiveChat({
        id: order.id,
        name: counterparty.fullName,
        service: service.title,
      })
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buyingOrders.map((order) => {
                const service = getServiceById(order.serviceId)
                const freelancer = getFreelancerById(order.freelancerId)

                if (!service || !freelancer) return null

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Order #{order.id.substring(0, 8)}</p>
                        </div>
                        {getStatusBadge(order.jobStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
                            <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{freelancer.fullName}</p>
                            <p className="text-xs text-muted-foreground">{freelancer.email.split("@")[0]}.eth</p>
                          </div>
                        </div>
                        <p className="font-bold">
                          {(service.tiers.find((t) => t.id === order.packageId)?.price || 0).toFixed(2)}{" "}
                          {order.currency}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {formatDate(order.deliveryDeadline)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Ordered on {formatDate(order.createdAt)}</span>
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenChat(order)}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        {order.jobStatus === "InProgress" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept Delivery
                          </Button>
                        )}
                        {order.jobStatus === "Disputed" && (
                          <Button size="sm" variant="destructive">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Request Revision
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="selling" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sellingOrders.map((order) => {
                const service = getServiceById(order.serviceId)
                const client = getClientById(order.clientId)

                if (!service || !client) return null

                return (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">Order #{order.id.substring(0, 8)}</p>
                        </div>
                        {getStatusBadge(order.jobStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={client.profilePictureUrl || "/placeholder.svg"} />
                            <AvatarFallback>{client.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{client.fullName}</p>
                            <p className="text-xs text-muted-foreground">{client.email.split("@")[0]}.eth</p>
                          </div>
                        </div>
                        <p className="font-bold">
                          {(service.tiers.find((t) => t.id === order.packageId)?.price || 0).toFixed(2)}{" "}
                          {order.currency}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {formatDate(order.deliveryDeadline)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Ordered on {formatDate(order.createdAt)}</span>
                      </div>

                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenChat(order)}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        {order.jobStatus === "InProgress" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Deliver Work
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
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
