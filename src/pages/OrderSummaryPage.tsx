"use client"

import { useEffect, useState } from "react"
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
import { Principal } from "@dfinity/principal"
import { Service_backend } from "@/declarations/Service_backend"
import { Freelancer_backend } from "@/declarations/Freelancer_backend"
import { Order_backend } from "@/declarations/Order_backend"
import { ServiceTier } from "@/declarations/Service_backend/Service_backend.did"
import { backend } from "@/utility/backend"

export function OrderSummaryPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userId, setUserId] = useState<Principal | null>(null);
  const [service, setService] = useState<any | null>(null);
  const [freelancer, setFreelancer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("ethereum")
  const [isConnectingWallet, setIsConnectingWallet] = useState<boolean>(false)
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false)
  const selectedPackage = location.state?.selectedPackage || "standard";

  // Check user authentication and fetch data
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get current user ID
        const currentUserId = await backend.whoami();
        setUserId(currentUserId);
        
        // Check if user has a profile
        const hasProfile = await backend.hasProfile(currentUserId);
        if (!hasProfile) {
          navigate("/register", { replace: true });
          return;
        }

        // Fetch service data
        if (!id) {
          setLoading(false);
          return;
        }
        
        const serviceResult = await Service_backend.getServiceDetails(id);
        if (!serviceResult || serviceResult.length === 0) {
          console.error("No service found for this ID.");
          toast({ title: "Error", description: "Service not found." });
          setLoading(false);
          return;
        }
        
        const serviceData = serviceResult[0];
        setService(serviceData);
        
        // Fetch freelancer data
        if (serviceData.freelancerId) {
          try {
            const freelancerData = await Freelancer_backend.getFreelancerProfile(serviceData.freelancerId);
            setFreelancer(freelancerData);
          } catch (err) {
            console.error("Failed to load freelancer data", err);
            toast({ title: "Warning", description: "Could not load freelancer information" });
          }
        }
      } catch (err) {
        console.error("Failed to initialize", err);
        toast({ title: "Error", description: "Failed to load required data" });
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id, navigate, toast]);

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

  const handlePlaceOrder = async () => {
    if (!isWalletConnected) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet before placing an order.",
      })
      return;
    }

    if (!userId || !service) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Cannot place order with missing user or service information.",
      })
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Get the selected package details
      const packageTier = service.tiers?.find((tier: ServiceTier) => tier.id === selectedPackage) || service.tiers[0];
      
      // Create order in backend
      await Order_backend.createOrder(
        userId, 
        service.freelancerId, 
        service.id, 
        selectedPackage, 
        "pending", 
        paymentMethod.toUpperCase(), 
        packageTier.deliveryDays
      );

      setTimeout(() => {
        setIsProcessingPayment(false);
        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and payment processed.",
        });
        navigate(`/orders-dashboard/${userId}`);
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
      setIsProcessingPayment(false);
      toast({
        variant: "destructive",
        title: "Order failed",
        description: "There was an error creating your order. Please try again.",
      });
    }
  }

  // You can return loading screen until data is ready
  if (loading) return <div className="container py-12 text-center">Loading...</div>;
  
  // If service not found after loading
  if (!service) return (
    <div className="container py-12 text-center">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Service not found. Please check the URL and try again.</AlertDescription>
      </Alert>
      <Button className="mt-4" onClick={() => navigate("/")}>Return to Home</Button>
    </div>
  );

  // Get the selected package details
  const packageTier = service.tiers?.find((tier: ServiceTier) => tier.id === selectedPackage) || service.tiers[0];

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
                          {packageTier.deliveryDays.toLocaleString()} day delivery
                        </span>
                      </div>
                      {freelancer && (
                        <div className="flex items-center gap-2 mt-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={freelancer.profilePictureUrl || "/placeholder.svg"} />
                            <AvatarFallback>{freelancer?.fullName?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{freelancer.fullName || "Freelancer"}</span>
                        </div>
                      )}
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
                      <span>{packageTier.deliveryDays.toLocaleString()} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revisions</span>
                      <span>{packageTier.revisions.toLocaleString()}</span>
                    </div>
                    <Separator className="my-2" />
                    <div>
                      <h4 className="font-medium mb-2">What's included:</h4>
                      <ul className="space-y-1">
                        {packageTier.features?.map((feature: string, index: string) => (
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
                      <span>{packageTier.price.toLocaleString()} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>{(Number(packageTier.price) * 0.05).toFixed(3)} ETH</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{(Number(packageTier.price) * 1.05).toFixed(3)} ETH</span>
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