// "use client"

import type React from "react"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
// import { actor } from "@/lib/motoko"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { Client_backend } from "@/declarations/Client_backend"
import { ClientProfile } from "@/declarations/Client_backend/Client_backend.did"
import { Freelancer_backend } from "@/declarations/Freelancer_backend"
import { FreelancerProfile } from "@/declarations/Freelancer_backend/Freelancer_backend.did"
import { useAuth } from "@/utility/use-auth-client";
// Form validation schema

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  dateOfBirth: z.date({
    required_error: "Please select a date of birth",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  profilePicture: z.any().optional(),
  accountType: z.enum(["client", "freelancer"], {
    required_error: "Please select an account type",
  }),
  skills: z.string().optional(),
})

type SignUpFormValues = z.infer<typeof signUpSchema>


export function SignUpForm() {
  
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { toast } = useToast()
  const { principal } = useAuth();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      accountType: "client",
    },
  })

  const accountType = watch("accountType")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const onSubmit = async (data: SignUpFormValues) => {
    
    setIsLoading(true)
  
    try {
      if (data.accountType === "client" && principal != null) {
        
        const clientProfile: ClientProfile = {
          id: principal,
          fullName: data.fullName,
          role: "Client",
          email: data.email,
          password: data.password,
          dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
          balance: 0,
          profilePictureUrl: profileImage || "",
          orderedServicesId: [], // Empty ordered services
        }
        const res  = await Client_backend.registerUser(clientProfile)
        console.log(res)
       
        // console.log("New client Principal ID:", id.toString())
      } else if(data.accountType === "freelancer" && principal != null) {
        const freelancerProfile: FreelancerProfile = {
          id: principal,
          fullName: data.fullName,
          role: "Freelancer",
          email: data.email,
          password: data.password,
          dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
          balance: 0,
          availabilityStatus: "Available",
          portfolioIds: [],
          reputationScore: 0.0,
          tokenRewards: 0.0,
          profilePictureUrl: profileImage || "",
          orderedServicesId: [], // Empty ordered services
          completedProjects: 0n,
          skills: data.skills ? data.skills.split(",") : [],
        }
        //Freelancer logic remains the same for now, assuming you haven't changed it
        await Freelancer_backend.registerFreelancerFromSignup(freelancerProfile)
        
      }
  
      toast({
        title: "Account created!",
        description: `Your ${data.accountType} account has been successfully created`,
      })

      navigate(`/profile/${principal}`)

    } 
    catch (error) {
      toast({
        title: "Registration failed",
        description: "There was an error creating your account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountType" className="text-white">
          Account Type
        </Label>
        <Controller
          control={control}
          name="accountType"
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="text-white cursor-pointer">
                  Client
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freelancer" id="freelancer" />
                <Label htmlFor="freelancer" className="text-white cursor-pointer">
                  Freelancer
                </Label>
              </div>
            </RadioGroup>
          )}
        />
        {errors.accountType && <p className="text-red-400 text-xs mt-1">{errors.accountType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-white">
          Full Name
        </Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
      </div>

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
        <Label htmlFor="dob" className="text-white">
          Date of Birth
        </Label>
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-black/30 border-purple-500/30 text-white hover:bg-black/50 transition-colors",
                    !field.value && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value, "PPP") : "Select your date of birth"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-black/90 border-purple-500/30">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className="bg-black text-white"
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.dateOfBirth && <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>}
      </div>

      {accountType === "freelancer" && (
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-white">
            Skills (comma separated)
          </Label>
          <Input
            id="skills"
            placeholder="Web Development, UI/UX Design, Blockchain"
            className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
            {...register("skills")}
          />
          {errors.skills && <p className="text-red-400 text-xs mt-1">{errors.skills.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
          {...register("password")}
        />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profile-picture" className="text-white">
          Profile Picture
        </Label>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-black/30 border border-purple-500/30 group">
            {profileImage ? (
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:text-purple-300 transition-colors">
                <Upload size={20} />
              </div>
            )}
          </div>

          <Controller
            name="profilePicture"
            control={control}
            render={({ field }) => (
              <Input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  field.onChange(e.target.files); // or e.target.files[0] if you only accept one file
                  handleImageChange(e); // For preview
                }}
                className="bg-black/30 border-purple-500/30 text-white focus:border-purple-400 transition-all"
              />
            )}
          />
          
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] disabled:opacity-70 disabled:transform-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
