"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Navigation } from "../components/navigation"
import { Footer } from "../components/footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Eye, EyeOff, Github, Mail, Calendar } from "lucide-react"
import { UserRole, AvailabilityStatus } from "../types/user"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar as CalendarComponent } from "../components/ui/calendar"
import { Badge } from "../components/ui/badge"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [date, setDate] = useState<Date>()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate("/login") // Redirect to login page after registration
    }, 1500)
  }

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      e.preventDefault()
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()])
      }
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 text-center transition-all duration-500">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {role === UserRole.FREELANCER ? "Join as a Freelancer" : "Join as a Client"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {role === UserRole.FREELANCER ? "Showcase your skills" : "Find top talent"}
          </p>
          <p className="text-base md:text-lg">
            {role === UserRole.FREELANCER
              ? "Create a freelancer account to showcase your skills and connect with clients worldwide. Start earning on your own terms."
              : "Create a client account to access our global marketplace of skilled freelancers. Find the perfect talent for your projects."}
          </p>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="border-border/40 shadow-lg">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                {step === 1 && "Choose your account type"}
                {step === 2 && "Enter your personal details"}
                {step === 3 && role === UserRole.FREELANCER && "Tell us about your skills"}
                {step === 3 && role === UserRole.CLIENT && "Set up your password"}
                {step === 4 && "Set up your password"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <form onSubmit={nextStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label>I want to join as a</Label>
                    <RadioGroup
                      defaultValue={role}
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value) => setRole(value as UserRole)}
                    >
                      <div>
                        <RadioGroupItem value={UserRole.CLIENT} id="client" className="peer sr-only" />
                        <Label
                          htmlFor="client"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-3 h-6 w-6"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          Client
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value={UserRole.FREELANCER} id="freelancer" className="peer sr-only" />
                        <Label
                          htmlFor="freelancer"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-3 h-6 w-6"
                          >
                            <path d="M12 12c-3 0-4 3-4 3l5 2 1-2" />
                            <path d="M9 9h.01" />
                            <path d="M15 9h.01" />
                            <path d="M12 16h.01" />
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" />
                          </svg>
                          Freelancer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={nextStep} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="name@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="w-1/2">
                      Continue
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && role === UserRole.FREELANCER && (
                <form onSubmit={nextStep} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1 flex items-center gap-1 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 rounded-full hover:bg-primary/20 p-1"
                            aria-label={`Remove ${skill} skill`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="relative">
                      <Input
                        id="skills"
                        placeholder="Type a skill and press Enter"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={addSkill}
                        className="pr-20"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1 h-7"
                        onClick={() => {
                          if (newSkill.trim() !== "" && !skills.includes(newSkill.trim())) {
                            setSkills([...skills, newSkill.trim()])
                            setNewSkill("")
                          }
                        }}
                      >
                        Add Skill
                      </Button>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Popular skills:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["React", "JavaScript", "UI/UX", "Node.js", "TypeScript"].map(
                          (suggestion) =>
                            !skills.includes(suggestion) && (
                              <Badge
                                key={suggestion}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10 transition-colors"
                                onClick={() => {
                                  if (!skills.includes(suggestion)) {
                                    setSkills([...skills, suggestion])
                                  }
                                }}
                              >
                                + {suggestion}
                              </Badge>
                            ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select defaultValue={AvailabilityStatus.AVAILABLE}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AvailabilityStatus.AVAILABLE}>Available</SelectItem>
                        <SelectItem value={AvailabilityStatus.BUSY}>Busy</SelectItem>
                        <SelectItem value={AvailabilityStatus.ON_VACATION}>On Vacation</SelectItem>
                        <SelectItem value={AvailabilityStatus.UNAVAILABLE}>Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="w-1/2">
                      Continue
                    </Button>
                  </div>
                </form>
              )}

              {((step === 3 && role === UserRole.CLIENT) || (step === 4 && role === UserRole.FREELANCER)) && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        terms of service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                    </label>
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-1/2" onClick={prevStep}>
                      Back
                    </Button>
                    <Button type="submit" className="w-1/2" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Wallet connection section */}
              {step > 4 && (
                <Tabs defaultValue="wallet" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 mb-6">
                    <TabsTrigger value="wallet">Connect Wallet</TabsTrigger>
                  </TabsList>

                  <TabsContent value="wallet">
                    <div className="space-y-4 py-2 text-center">
                      <Button variant="outline" className="w-full bg-background">
                        Connect Wallet
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Connect your wallet to create an account securely without a password
                      </p>
                    </div>
                  </TabsContent>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <Github className="mr-2 h-4 w-4" />
                      Github
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>
                </Tabs>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
