"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "@/components/SignInForm"
import { SignUpForm } from "@/components/SignUpForm"
import { connectToInternetIdentity } from "@/lib/motoko"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import astronautBg from "@/assets/astronaut-bg.jpeg"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("sign-in")
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Handle Internet Identity authentication
  const handleIIAuth = async () => {
    setIsConnecting(true)

    try {
      const identity = await connectToInternetIdentity()

      if (identity) {
        toast({
          title: "Successfully authenticated",
          description: `Connected with principal: ${identity.getPrincipal()}`,
        })
      } else {
        throw new Error("Authentication failed")
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Could not connect to Internet Identity",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left side - Auth content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-black relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 animate-text-glow">Cosmic Connect</h1>
            <p className="text-purple-200">Secure Web3 Authentication with Internet Identity</p>
          </div>

          <Card className="bg-black/60 backdrop-blur-md border border-purple-500/30 shadow-xl shadow-purple-500/20 animate-card-appear">
            <Tabs defaultValue="sign-in" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 bg-black/40">
                <TabsTrigger
                  value="sign-in"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-cyan-500/50 transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="sign-up"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-cyan-500/50 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in" className="p-6">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up" className="p-6">
                <SignUpForm />
              </TabsContent>
            </Tabs>

            <div className="p-6 pt-0 flex flex-col items-center">
              <div className="relative w-full flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-sm text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              <Button
                variant="outline"
                className="w-full mb-4 bg-transparent border-purple-500/50 hover:bg-purple-900/30 text-white transition-all duration-300 hover:border-purple-400 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)] transform hover:scale-[1.02]"
                onClick={handleIIAuth}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="mr-2 size-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 pulse-slow"></div>
                    Internet Identity
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Animated overlay elements for left side */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="glow-circle top-1/4 left-1/4"></div>
          <div className="glow-circle bottom-1/3 right-1/3"></div>
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={astronautBg || "/placeholder.svg"}
          alt="Space background with astronaut"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Animated overlay elements for right side */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="cosmic-particles"></div>
        </div>
      </div>
    </div>
  )
}
