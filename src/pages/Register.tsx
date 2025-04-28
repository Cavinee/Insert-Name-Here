"use client"

import type React from "react"
import { useState } from "react"
import { Wallet, User, Briefcase, ChevronRight, ChevronLeft, Check, X, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthClient } from "@dfinity/auth-client"
import CustomizedSteppers from "@/components/progress-stepper"

export default function RegisterForm() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<"forward" | "backward" | null>(null)
  const [accountType, setAccountType] = useState<"freelancer" | "client" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    bio: "",
    location: "",
    profileImage: "",
    contactInfo: "",

    // Freelancer specific
    dateOfBirth: "",
    principal: "",
    skills: [] as string[],
    availabilityStatus: "Available",

    // Client specific
    companyName: "",
    industry: "",
  })

  const [currentSkill, setCurrentSkill] = useState("")
  const [identityConnected, setIdentityConnected] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = ["Account Type", "Basic Info", "Profile", "Wallet", "Review"]

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1 && !accountType) {
      newErrors.accountType = "Please select an account type"
    }

    if (currentStep === 2) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.username.trim()) newErrors.username = "Username is required"
      if (!formData.password) newErrors.password = "Password is required"
      else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
      if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    if (currentStep === 3) {
      if (accountType === "freelancer") {
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (formData.skills.length === 0) newErrors.skills = "At least one skill is required"
      }

      if (accountType === "client") {
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required"
        if (!formData.industry.trim()) newErrors.industry = "Industry is required"
      }
    }

    if (currentStep === 4 && !identityConnected) {
      newErrors.wallet = "Wallet connection is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection("forward")
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setDirection("backward")
    setStep(step - 1)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()],
      })
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const connectPrincipal = async () => {
    const authClient = await AuthClient.create();

    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toText();

        setStep(prevStep => prevStep + 1);

        setTimeout(() => {
          setIdentityConnected(true)
          setFormData({
            ...formData,
            principal: principal,
          })
        }, 1000)
      },
    });

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(step)) {
      // Here you would typically send the data to your backend
      console.log("Form submitted:", { accountType, ...formData })
      // Move to success step
      setDirection("forward")
      setStep(6)
    }
  }

  const variants = {
    enter: (direction: "forward" | "backward") => {
      return {
        x: direction === "forward" ? 20 : -20,
        opacity: 0,
      }
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "forward" | "backward") => {
      return {
        x: direction === "forward" ? -20 : 20,
        opacity: 0,
      }
    },
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Choose Account Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAccountType("freelancer")}
                className={`p-6 border rounded-lg flex flex-col items-center space-y-4 transition-all ${
                  accountType === "freelancer"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-emerald-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Freelancer</h3>
                  <p className="text-gray-500 text-sm">Find work and offer your services</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAccountType("client")}
                className={`p-6 border rounded-lg flex flex-col items-center space-y-4 transition-all ${
                  accountType === "client"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Briefcase size={32} className="text-emerald-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">Client</h3>
                  <p className="text-gray-500 text-sm">Hire talent and post projects</p>
                </div>
              </button>
            </div>
            {errors.accountType && <p className="text-red-500 text-sm">{errors.accountType}</p>}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.username ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Choose a unique username"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Tell us a bit about yourself"
                ></textarea>
              </div>
            </div>
          </div>
        )

      case 3:
        return accountType === "freelancer" ? (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Freelancer Profile</h2>
            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="currentSkill"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-l-md"
                    placeholder="Add a skill (e.g., Web Development)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-emerald-600 text-white px-4 rounded-r-md hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}

                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  id="availabilityStatus"
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Vacation">On Vacation</option>
                  <option value="Limited Availability">Limited Availability</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Client Profile</h2>
            <div className="space-y-4 text-left">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Your company name"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${errors.industry ? "border-red-500" : "border-gray-300"}`}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
                {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={40} className="text-emerald-600" />
              </div>
              <p className="mb-6 text-gray-600">
                Connect your Internet Identity
              </p>

              {!identityConnected ? (
                <div>
                  <button
                    type="button"
                    onClick={connectPrincipal}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700"
                  >
                    Connect Wallet
                  </button>
                  {errors.wallet && <p className="text-red-500 text-sm mt-2">{errors.wallet}</p>}
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <Check size={20} />
                    <span>Principal Connected</span>
                  </div>
                  <p className="mt-2 text-gray-600">Principal Address: {formData.principal}</p>
                </div>
              )}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-bold">Review Your Information</h2>
            <div className="space-y-4 border border-gray-200 rounded-lg p-6 text-left">
              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Account Type</h3>
                <p className="capitalize">{accountType}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p>{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p>{formData.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{formData.location || "Not provided"}</p>
                  </div>
                </div>
                {formData.bio && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Bio</p>
                    <p>{formData.bio}</p>
                  </div>
                )}
              </div>

              {accountType === "freelancer" ? (
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Freelancer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p>{formData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p>{formData.availabilityStatus}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-2">Client Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p>{formData.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p>{formData.industry}</p>
                    </div>
                    {formData.dateOfBirth && (
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p>{formData.dateOfBirth}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg border-b pb-2 mb-2">Principal Information</h3>
                <div>
                  <p className="text-sm text-gray-500">Principal Address</p>
                  <p className="font-mono">{formData.principal}</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold">Registration Complete!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your {accountType} account has been created successfully. You can now start using the platform to
              {accountType === "freelancer" ? " find work and offer your services." : " hire talent and post projects."}
            </p>
            <div>
              <a
                href="/dashboard"
                className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 inline-block"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-emerald-600 p-6">
            <h1 className="text-white text-3xl font-bold text-center">Join Cointract</h1>
            {step < 6 && (
              <div className="mt-7">
                <CustomizedSteppers step={step} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            {step < 6 && (
              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft size={20} />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 flex items-center"
                  >
                    <span>Continue</span>
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700">
                    Complete Registration
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
