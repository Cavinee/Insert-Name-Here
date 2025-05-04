// Generated dummy data based on Motoko types
import { validateMarketplaceData } from "./validate-marketplace-data"

// Helper function to generate a random Principal ID
function generatePrincipal() {
  return `aaaaa-${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`
}

// Types based on Motoko definitions
export type UserRole = "Client" | "Freelancer" | "Admin"
export type JobStatus = "InProgress" | "Delivered" | "Completed" | "Cancelled" | "Disputed"
export type OrderStatus = "Accepted" | "Rejected" | "Undecided"
export type PaymentStatus = "Pending" | "Paid" | "Refunded" | "Disputed"
export type AvailabilityStatus = "Available" | "Busy" | "OnVacation"
export type PaymentMethod = "Escrow" | "Direct"
export type ContractType = "FixedPrice" | "Hourly"

export interface ClientProfile {
  id: string
  role: UserRole
  fullName: string
  email: string
  dateOfBirth: string
  balance: number
  profilePictureUrl: string
  orderedServicesId: string[]
}

export interface FreelancerProfile extends ClientProfile {
  skills: string[]
  portfolioIds: string[] | null
  reputationScore: number
  completedProjects: number
  tokenRewards: number
  availabilityStatus: AvailabilityStatus
}

export interface PortfolioItem {
  id: string
  freelancerId: string
  title: string
  description: string
  category: string
  images: string[]
  video: string | null
  link: string | null
}

export interface Image {
  imageUrl: string
  imageTag: string
}

export interface ServiceTier {
  id: string
  name: string
  description: string
  price: number
  deliveryDays: number
  revisions: number
  features: string[]
}

export interface Service {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  startingPrice: number
  currency: string
  deliveryTimeMin: number
  status: JobStatus
  freelancerId: string
  createdAt: number
  updatedAt: number
  tags: string[]
  attachments: Image[] | null
  tiers: ServiceTier[]
  contractType: ContractType
  paymentMethod: PaymentMethod
  averageRating: number | null
  totalReviews: number
}

export interface Revision {
  id: string
  description: string
  numberOfRevision: number
}

export interface Order {
  id: string
  clientId: string
  freelancerId: string
  serviceId: string
  packageId: string
  orderStatus: OrderStatus
  jobStatus: JobStatus
  createdAt: number
  updatedAt: number
  paymentStatus: PaymentStatus
  currency: string
  deliveryDeadline: number
  cancellationReason: string | null
  revisions: Revision[]
  revisionMaxLimit: number
  isReviewed?: boolean
}

export interface Review {
  id: string
  orderId: string
  serviceId: string
  reviewerId: string
  recipientId: string
  rating: number
  comment: string
  createdAt: number
  freelancerResponse: string | null
  reviewType: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  time: number
  messageHash: string | null
}

export interface Chat {
  id: string
  participants: string[]
  isChatbot: boolean
  messages: Message[] | null
  createdAt: string
  lastUpdated: string
  freelancerPrioritySupport: boolean
}

// Generate client profiles
const clients: ClientProfile[] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: generatePrincipal(),
    role: "Client" as UserRole,
    fullName: [
      "Alex Johnson",
      "Taylor Smith",
      "Jordan Lee",
      "Morgan Williams",
      "Casey Brown",
      "Riley Davis",
      "Quinn Wilson",
      "Avery Miller",
      "Jamie Garcia",
      "Drew Martinez",
    ][i % 10],
    email: `client${i + 1}@example.com`,
    dateOfBirth: `1985-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    balance: Number.parseFloat((Math.random() * 5).toFixed(2)),
    profilePictureUrl: `/placeholder.svg?text=Client${i + 1}`,
    orderedServicesId: Array(Math.floor(Math.random() * 5))
      .fill("")
      .map(() => generatePrincipal()),
  }))

// Generate freelancer profiles
const freelancers: FreelancerProfile[] = Array(20)
  .fill(null)
  .map((_, i) => {
    const skills = [
      ["React", "TypeScript", "Next.js", "UI/UX"],
      ["Graphic Design", "Illustration", "Branding", "Logo Design"],
      ["Content Writing", "SEO", "Copywriting", "Editing"],
      ["Video Editing", "Animation", "Motion Graphics", "VFX"],
      ["Digital Marketing", "Social Media", "Email Marketing", "PPC"],
      ["WordPress", "Shopify", "Webflow", "E-commerce"],
      ["Mobile Development", "iOS", "Android", "React Native"],
      ["3D Modeling", "Blender", "Maya", "Product Visualization"],
      ["Data Analysis", "Python", "R", "Visualization"],
      ["Blockchain", "Smart Contracts", "Web3", "DeFi"],
    ][i % 10]

    const completedProjects = Math.floor(Math.random() * 50) + 1

    return {
      id: generatePrincipal(),
      role: "Freelancer" as UserRole,
      fullName: [
        "Sam Wilson",
        "Jordan Taylor",
        "Alex Morgan",
        "Casey Parker",
        "Riley Quinn",
        "Jamie Drew",
        "Avery Blake",
        "Morgan Reed",
        "Taylor Jordan",
        "Drew Casey",
        "Quinn Riley",
        "Blake Avery",
        "Reed Morgan",
        "Lee Taylor",
        "Parker Casey",
        "Smith Jordan",
        "Brown Alex",
        "Miller Sam",
        "Garcia Jamie",
        "Martinez Drew",
      ][i % 20],
      email: `freelancer${i + 1}@example.com`,
      dateOfBirth: `1990-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      balance: Number.parseFloat((Math.random() * 10).toFixed(2)),
      profilePictureUrl: `/placeholder.svg?text=Freelancer${i + 1}`,
      orderedServicesId: Array(Math.floor(Math.random() * 3))
        .fill("")
        .map(() => generatePrincipal()),
      skills,
      portfolioIds:
        i % 3 === 0
          ? null
          : Array(Math.floor(Math.random() * 5) + 1)
              .fill("")
              .map((_, idx) => `portfolio-${i}-${idx}`),
      reputationScore: Number.parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      completedProjects,
      tokenRewards: Number.parseFloat((completedProjects * 0.5).toFixed(1)),
      availabilityStatus: ["Available", "Busy", "OnVacation"][Math.floor(Math.random() * 3)] as AvailabilityStatus,
    }
  })

// Generate portfolio items
const portfolioItems: PortfolioItem[] = []

freelancers.forEach((freelancer) => {
  if (!freelancer.portfolioIds) return

  freelancer.portfolioIds.forEach((portfolioId, idx) => {
    portfolioItems.push({
      id: portfolioId,
      freelancerId: freelancer.id,
      title: [
        "AI-Powered Web Application Development",
        "Cloud Infrastructure Setup & Optimization",
        "Custom Dashboard for Data Analytics",
        "End-to-End Mobile App Development",
        "Cybersecurity Audit & Hardening",
        "Machine Learning Model Integration",
        "Automation Script for Business Workflow",
        "API Development & Integration Services"
      ][idx % 8],
      description:
        "Professional work showcasing expertise in this area with attention to detail and client satisfaction.",
      category: freelancer.skills[0],
      images: Array(Math.floor(Math.random() * 3) + 1)
        .fill("")
        .map((_, i) => `/placeholder.svg?height=400&width=600&text=Portfolio${idx + 1}_${i + 1}`),
      video: idx % 3 === 0 ? `/placeholder-video.mp4` : null,
      link: idx % 2 === 0 ? `https://example.com/portfolio/${portfolioId}` : null,
    })
  })
})

// Generate services
const services: Service[] = Array(30)
  .fill(null)
  .map((_, i) => {
    const freelancer = freelancers[i % freelancers.length]
    const categories = ["WebDevelopment", "MobileDevelopment", "MachineLearning", "CloudServices", "SoftwareTesting", "TechnicalWriting", "Database", "AutomationAndScripting"]
    const subcategories: Record<string, string[]> = {
      WebDevelopment: [ "Frontend Developer", "Backend Developer", "Fullstack Developer", "Website Maintenance & Bug Fixes"],
      MobileDevelopment: [ "iOS Developer", "Android Developer", "Flutter/React Native Developer","App Testing & Debugging"],
      MachineLearning: [ "Data Analyst", "Machine Learning Engineer", "Data Cleaning & Visualization", "AI Model Deployment"],
      CloudServices: [ "DevOps Engineer (AWS, GCP, Azure)", "Docker/Kubernetes Setup", "CI/CD Pipeline Setup", "Server Monitoring & Scaling"],
      SoftwareTesting: [ "QA Tester (Manual & Automation)", "Bug Tracking & Reporting", "Unit & Integration Tester", "Performance Tester"],
      TechnicalWriting: [ "API Documentation Writer", "Tutorial & Guide Writer", "Technical Article Writer", "Research Summary Writer"],
      Database: [ "SQL Developer", "Database Administrator", "NoSQL/BigQuery Engineer", "Data Migration Specialist"],
      AutomationAndScripting: [ "Python Automation Scripts", "Task Automation (Bash, PowerShell)", "Web Scraping Projects", "API Integration Services"],
    }

    const category = categories[i % categories.length]
    const subcategory = subcategories[category][Math.floor(Math.random() * subcategories[category].length)]

    // Generate tiers (Basic, Standard, Premium)
    const basePrice = 50 + Math.floor(Math.random() * 100)
    const tiers: ServiceTier[] = [
      {
        id: "basic",
        name: "Basic",
        description: `Entry-level ${category.toLowerCase()} service for those with simple needs and limited budget.`,
        price: basePrice,
        deliveryDays: 3 + Math.floor(Math.random() * 4),
        revisions: 1 + Math.floor(Math.random() * 2),
        features: ["Basic consultation", `Standard ${subcategory.toLowerCase()}`, "1 concept/draft", "Source files"],
      },
      {
        id: "standard",
        name: "Standard",
        description: `Complete ${category.toLowerCase()} solution with additional features and priority support.`,
        price: basePrice * 2,
        deliveryDays: 2 + Math.floor(Math.random() * 3),
        revisions: 2 + Math.floor(Math.random() * 3),
        features: [
          "Everything in Basic",
          "In-depth consultation",
          `Advanced ${subcategory.toLowerCase()}`,
          "3 concepts/drafts",
          "Source files",
          "Commercial use rights",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: `Premium ${category.toLowerCase()} service with all features, fastest delivery, and VIP support.`,
        price: basePrice * 3,
        deliveryDays: 1 + Math.floor(Math.random() * 2),
        revisions: 5,
        features: [
          "Everything in Standard",
          "Priority support",
          "VIP consultation",
          `Premium ${subcategory.toLowerCase()}`,
          "5 concepts/drafts",
          "Source files",
          "Commercial use rights",
          "Express delivery",
          "30 days support",
        ],
      },
    ]

    // Ensure createdAt is before updatedAt
    const createdAt = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 7776000) // Up to 90 days ago
    const updatedAt = createdAt + Math.floor(Math.random() * 2592000) // Up to 30 days after creation

    return {
      id: generatePrincipal(),
      title: [
        `Professional ${subcategory}`,
        `Custom ${subcategory} Service`,
        `Expert ${subcategory} Solutions`,
        `Premium ${subcategory}`,
      ][Math.floor(Math.random() * 4)],
      description: `I'll create professional ${category.toLowerCase()} that elevates your brand with unlimited revisions until you're satisfied.`,
      category,
      subcategory,
      startingPrice: Math.min(...tiers.map((tier) => tier.price)),
      currency: "ETH",
      deliveryTimeMin: Math.min(...tiers.map((tier) => tier.deliveryDays)),
      status: "InProgress" as JobStatus,
      freelancerId: freelancer.id,
      createdAt,
      updatedAt,
      tags: freelancer.skills.slice(0, 3),
      attachments: Array(Math.floor(Math.random() * 3) + 1)
        .fill(null)
        .map((_, idx) => ({
          imageUrl: `/placeholder.svg?height=400&width=600&text=${category}_${idx + 1}`,
          imageTag: `${subcategory} Sample ${idx + 1}`,
        })),
      tiers,
      contractType: Math.random() > 0.3 ? "FixedPrice" : ("Hourly" as ContractType),
      paymentMethod: Math.random() > 0.2 ? "Escrow" : ("Direct" as PaymentMethod),
      averageRating: i % 5 === 0 ? null : Number.parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      totalReviews: Math.floor(Math.random() * 50),
    }
  })

// Generate orders
const orders: Order[] = Array(40)
  .fill(null)
  .map((_, i) => {
    const client = clients[i % clients.length]
    const service = services[i % services.length]
    const freelancer = freelancers.find((f) => f.id === service.freelancerId)!
    const tier = service.tiers[Math.floor(Math.random() * service.tiers.length)]

    const createdAt = Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 5184000) // Up to 60 days ago
    const updatedAt = createdAt + Math.floor(Math.random() * 604800) // Up to 7 days later

    // Generate random status based on probabilities
    let orderStatus: OrderStatus, jobStatus: JobStatus, paymentStatus: PaymentStatus
    const statusRandom = Math.random()

    if (statusRandom < 0.7) {
      orderStatus = "Accepted"

      const jobRandom = Math.random()
      if (jobRandom < 0.4) {
        jobStatus = "InProgress"
        paymentStatus = "Pending"
      } else if (jobRandom < 0.7) {
        jobStatus = "Delivered"
        paymentStatus = "Paid"
      } else if (jobRandom < 0.9) {
        jobStatus = "Completed"
        paymentStatus = "Paid"
      } else {
        jobStatus = "Disputed"
        paymentStatus = "Disputed"
      }
    } else if (statusRandom < 0.9) {
      orderStatus = "Rejected"
      jobStatus = "Cancelled"
      paymentStatus = "Refunded"
    } else {
      orderStatus = "Undecided"
      jobStatus = "InProgress"
      paymentStatus = "Pending"
    }

    // Generate revisions
    const revisions: Revision[] = []
    if (jobStatus === "Delivered" || jobStatus === "Completed") {
      const revisionCount = Math.floor(Math.random() * tier.revisions)
      for (let j = 0; j < revisionCount; j++) {
        revisions.push({
          id: `revision-${i}-${j}`,
          description: `Revision request ${j + 1}: Please adjust the ${["colors", "layout", "text", "design elements"][j % 4]}.`,
          numberOfRevision: j + 1,
        })
      }
    }

    // Ensure delivery deadline is after creation date
    const deliveryDeadline = createdAt + tier.deliveryDays * 86400

    // Ensure cancellation reason is provided for cancelled orders
    const cancellationReason =
      jobStatus === "Cancelled" ? "Client requested cancellation due to changed requirements." : null

    return {
      id: generatePrincipal(),
      clientId: client.id,
      freelancerId: freelancer.id,
      serviceId: service.id,
      packageId: tier.id,
      orderStatus,
      jobStatus,
      createdAt,
      updatedAt,
      paymentStatus,
      currency: "ETH",
      deliveryDeadline,
      cancellationReason,
      revisions,
      revisionMaxLimit: tier.revisions,
    }
  })

// Generate reviews
const reviews: Review[] = []

orders.forEach((order, i) => {
  // Only completed orders have reviews
  if (order.jobStatus !== "Completed") return

  const rating = Math.floor(Math.random() * 3) + 3 // 3-5 stars

  // Client to freelancer review
  reviews.push({
    id: generatePrincipal(),
    orderId: order.id,
    serviceId: order.serviceId,
    reviewerId: order.clientId,
    recipientId: order.freelancerId,
    rating,
    comment: [
      "Excellent service! The work was delivered on time and exceeded my expectations.",
      "Great communication throughout the project. Would definitely hire again.",
      "Very professional and responsive. The quality of work was outstanding.",
      "Talented freelancer who understood my requirements perfectly.",
      "Amazing work! Exactly what I was looking for.",
    ][i % 5],
    createdAt: order.updatedAt + 86400, // 1 day after order completion
    freelancerResponse:
      Math.random() > 0.5 ? "Thank you for your kind review! It was a pleasure working with you." : null,
    reviewType: "client-to-freelancer",
  })

  // Sometimes freelancer reviews client too
  if (Math.random() > 0.3) {
    reviews.push({
      id: generatePrincipal(),
      orderId: order.id,
      serviceId: order.serviceId,
      reviewerId: order.freelancerId,
      recipientId: order.clientId,
      rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
      comment: [
        "Great client to work with! Clear requirements and prompt communication.",
        "Excellent collaboration. Would love to work together again.",
        "Very responsive and understanding client.",
        "Clear instructions and respectful communication throughout the project.",
        "A pleasure to work with this client.",
      ][i % 5],
      createdAt: order.updatedAt + 86400 + 3600, // 1 day + 1 hour after order completion
      freelancerResponse: null,
      reviewType: "freelancer-to-client",
    })
  }
})

// Validate the generated data
const validationResult = validateMarketplaceData(clients, freelancers, portfolioItems, services, orders, reviews)

// Log validation results
if (!validationResult.valid) {
  console.warn("Validation warnings found in the generated marketplace data:")
  Object.entries(validationResult.errors).forEach(([entityType, errors]) => {
    if (errors.length > 0) {
      console.warn(`\n${entityType.toUpperCase()} WARNINGS:`)
      errors.forEach((error) => console.warn(`- ${error}`))
    }
  })

  // Don't throw an error, just log warnings
  console.warn("Proceeding with data that has validation warnings")
} else {
  console.log("✅ Marketplace data validation successful!")
}

// Helper functions to get data
export function getFreelancerById(id: string): FreelancerProfile | undefined {
  return freelancers.find((f) => f.id === id)
}

export function getClientById(id: string): ClientProfile | undefined {
  return clients.find((c) => c.id === id)
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id)
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}

export function getReviewsForService(serviceId: string): Review[] {
  return reviews.filter((r) => r.serviceId === serviceId && r.reviewType === "client-to-freelancer")
}

export function getReviewsForFreelancer(freelancerId: string): Review[] {
  return reviews.filter((r) => r.recipientId === freelancerId && r.reviewType === "client-to-freelancer")
}

export function getReviewsForClient(clientId: string): Review[] {
  return reviews.filter((r) => r.recipientId === clientId && r.reviewType === "freelancer-to-client")
}

export function getServicesByCategory(category: string): Service[] {
  return services.filter((s) => s.category === category)
}

export function getServicesByFreelancer(freelancerId: string): Service[] {
  return services.filter((s) => s.freelancerId === freelancerId)
}

export function getOrdersByClient(clientId: string): Order[] {
  return orders.filter((o) => o.clientId === clientId)
}

export function getOrdersByFreelancer(freelancerId: string): Order[] {
  return orders.filter((o) => o.freelancerId === freelancerId)
}

export function formatPrice(price: number, currency = "ETH"): string {
  return `${price.toFixed(2)} ${currency}`
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString()
}

// Log successful validation
console.log("✅ Marketplace data validation successful!")

export { clients, freelancers, portfolioItems, services, orders, reviews }
