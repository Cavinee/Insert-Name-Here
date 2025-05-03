"use client"

import { useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Wallet, Clock, CheckCircle, AlertCircle, Info } from "lucide-react"
import { getServiceById, getFreelancerById } from "../lib/marketplace-data"
import { useToast } from "@/components/ui/use-toast"

export default function OrderSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Get the selected package from location state or default to "standard"
  const selectedPackage = location.state?.selectedPackage || "standard"

  // Find the service by ID
  const service = id ? getServiceById(id) || null : null
  const freelancer = service ? getFreelancerById(service.freelancerId) : null

  const [paymentMethod, setPaymentMethod] = useState<string>("ethereum")
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false)
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)

  if (!service || !freelancer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Service not found. Please try again or contact support.</AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  // Get the selected package details
  const packageTier = service.tiers?.find((tier) => tier.id === selectedPackage) ||
    service.tiers?.[1] || {
      id: "standard",
      name: "Standard",
      price: service.startingPrice || 0.1,
      deliveryTime: service.deliveryTimeMin || 3,
      revisions: 2,
      features: ["Standard quality", "2 revisions", "Source files"],
    }

  const handleConnectWallet = () => {
    setIsConnectingWallet(true)

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnectingWallet(false)
      setIsWalletConnected(true)
      toast({
        title: "Wallet connected",
        description: "Your crypto wallet has been successfully connected.",
      })
    }, 1500)
  }

  const handlePlaceOrder = () => {
    if (!isWalletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet before placing an order.",
      })
      return
    }

    setIsProcessingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false)
      toast({
        title: "Order placed successfully!",
        description: "Your order has been placed and payment processed.",
      })
      navigate("/orders")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Order Summary</h1>
          <p className="text-muted-foreground mb-8">Review your order details before proceeding to payment</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Order details */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={service.attachments?.[0]?.imageUrl || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{service.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{service.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3 w-3 mr-1" />
                          {packageTier.deliveryDays} day delivery
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
                          <AvatarFallback>{freelancer.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{freelancer.fullName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                  <CardDescription>{packageTier.name} Package</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Delivery Time</span>
                      <span>{packageTier.deliveryDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revisions</span>
                      <span>{packageTier.revisions}</span>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <h4 className="font-medium mb-2">What's included:</h4>
                      <ul className="space-y-1">
                        {packageTier.features?.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Connect your crypto wallet to complete the payment</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ethereum" id="ethereum" />
                      <Label htmlFor="ethereum" className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=24&width=24&text=ETH" alt="Ethereum" className="h-6 w-6" />
                        Ethereum
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bitcoin" id="bitcoin" />
                      <Label htmlFor="bitcoin" className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=24&width=24&text=BTC" alt="Bitcoin" className="h-6 w-6" />
                        Bitcoin
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="usdc" id="usdc" />
                      <Label htmlFor="usdc" className="flex items-center gap-2">
                        <img src="/placeholder.svg?height=24&width=24&text=USDC" alt="USDC" className="h-6 w-6" />
                        USDC
                      </Label>
                    </div>
                  </RadioGroup>

                  <div className="mt-6">
                    {isWalletConnected ? (
                      <Alert className="bg-success/20 text-success border-success">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Wallet Connected</AlertTitle>
                        <AlertDescription>Your wallet is connected and ready for payment.</AlertDescription>
                      </Alert>
                    ) : (
                      <Button onClick={handleConnectWallet} className="w-full" disabled={isConnectingWallet}>
                        {isConnectingWallet ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-4 w-4" />
                            Connect Wallet
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order summary */}
            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{packageTier.price} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>{(packageTier.price * 0.05).toFixed(3)} ETH</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{(packageTier.price * 1.05).toFixed(3)} ETH</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isProcessingPayment}>
                      {isProcessingPayment ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      By placing this order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-2">
                  <Alert variant="default" className="text-xs">
                    <Info className="h-3 w-3" />
                    <AlertDescription>
                      Your payment will be held in escrow until you approve the delivered work.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
