// "use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { actor } from "@/lib/motoko"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";

// Form validation schema
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const navigate = useNavigate()

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true)

    try {
      const user = await actor.loginUser(data.email, data.password)

      if (user) {

        toast({
          title: "Success!",
          description: `Welcome back, ${user.fullname}`,
        })
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
    navigate("/")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
          {...register("email")}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <a href="#" className="text-xs text-purple-300 hover:text-purple-200 transition-colors">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
          {...register("password")}
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-70 disabled:transform-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}
