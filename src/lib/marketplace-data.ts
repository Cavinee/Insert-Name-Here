// Sample marketplace data for development and testing

// Utility function to format price with currency
export const formatPrice = (price: number, currency = "ETH") => {
  return `${price.toFixed(2)} ${currency}`
}

// Categories with proper spacing
export const categories = [
  "WebDevelopment",
  "MobileDevelopment",
  "MachineLearning",
  "CloudServices",
  "SoftwareTesting",
  "TechnicalWriting",
  "Database",
  "AutomationAndScripting",
]

// Subcategories for each category
export const subcategories: Record<string, string[]> = {
  WebDevelopment: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Website Maintenance & Bug Fixes"],
  MobileDevelopment: [
    "iOS Developer",
    "Android Developer",
    "Flutter/React Native Developer",
    "App Testing & Debugging",
  ],
  MachineLearning: [
    "Data Analyst",
    "Machine Learning Engineer",
    "Data Cleaning & Visualization",
    "AI Model Deployment",
  ],
  CloudServices: [
    "DevOps Engineer (AWS, GCP, Azure)",
    "Docker/Kubernetes Setup",
    "CI/CD Pipeline Setup",
    "Server Monitoring & Scaling",
  ],
  SoftwareTesting: [
    "QA Tester (Manual & Automation)",
    "Bug Tracking & Reporting",
    "Unit & Integration Tester",
    "Performance Tester",
  ],
  TechnicalWriting: [
    "API Documentation Writer",
    "Tutorial & Guide Writer",
    "Technical Article Writer",
    "Research Summary Writer",
  ],
  Database: ["SQL Developer", "Database Administrator", "NoSQL/BigQuery Engineer", "Data Migration Specialist"],
  AutomationAndScripting: [
    "Python Automation Scripts",
    "Task Automation (Bash, PowerShell)",
    "Web Scraping Projects",
    "API Integration Services",
  ],
}

// Sample services data
export const services = [
  {
    id: "service-1",
    title: "Professional Frontend Developer",
    description:
      "I'll create professional web development that elevates your brand with unlimited revisions until you're satisfied.",
    category: "WebDevelopment",
    subcategory: "Frontend Developer",
    freelancerId: "freelancer-1",
    startingPrice: 75,
    currency: "ETH",
    deliveryTimeMin: 3,
    deliveryTimeMax: 7,
    revisions: 3,
    averageRating: 4.8,
    totalReviews: 42,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    tags: ["React", "TypeScript", "Next.js"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=Frontend+Development",
        imageTag: "Frontend Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level web development service for those with simple needs and limited budget.",
        price: 75,
        deliveryDays: 5,
        revisions: 1,
        features: ["Basic consultation", "Standard frontend development", "1 concept/draft", "Source files"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete web development solution with additional features and priority support.",
        price: 150,
        deliveryDays: 3,
        revisions: 3,
        features: [
          "Everything in Basic",
          "In-depth consultation",
          "Advanced frontend development",
          "3 concepts/drafts",
          "Source files",
          "Commercial use rights",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium web development service with all features, fastest delivery, and VIP support.",
        price: 225,
        deliveryDays: 2,
        revisions: 5,
        features: [
          "Everything in Standard",
          "Priority support",
          "VIP consultation",
          "Premium frontend development",
          "5 concepts/drafts",
          "Source files",
          "Commercial use rights",
          "Express delivery",
          "30 days support",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-2",
    title: "Custom iOS Developer Service",
    description:
      "I'll create professional mobile development that elevates your brand with unlimited revisions until you're satisfied.",
    category: "MobileDevelopment",
    subcategory: "iOS Developer",
    freelancerId: "freelancer-2",
    startingPrice: 100,
    currency: "ETH",
    deliveryTimeMin: 7,
    deliveryTimeMax: 14,
    revisions: 2,
    averageRating: 4.9,
    totalReviews: 28,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    tags: ["iOS", "Swift", "Mobile"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=iOS+Development",
        imageTag: "iOS Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level iOS development service for those with simple needs and limited budget.",
        price: 100,
        deliveryDays: 7,
        revisions: 1,
        features: ["Basic consultation", "Standard iOS development", "1 concept/draft", "Source files"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete iOS development solution with additional features and priority support.",
        price: 200,
        deliveryDays: 5,
        revisions: 3,
        features: [
          "Everything in Basic",
          "In-depth consultation",
          "Advanced iOS development",
          "3 concepts/drafts",
          "Source files",
          "Commercial use rights",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium iOS development service with all features, fastest delivery, and VIP support.",
        price: 300,
        deliveryDays: 3,
        revisions: 5,
        features: [
          "Everything in Standard",
          "Priority support",
          "VIP consultation",
          "Premium iOS development",
          "5 concepts/drafts",
          "Source files",
          "Commercial use rights",
          "Express delivery",
          "30 days support",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-3",
    title: "Expert Machine Learning Engineer Solutions",
    description:
      "I'll create professional machine learning solutions that elevate your brand with unlimited revisions until you're satisfied.",
    category: "MachineLearning",
    subcategory: "Machine Learning Engineer",
    freelancerId: "freelancer-3",
    startingPrice: 150,
    currency: "ETH",
    deliveryTimeMin: 5,
    deliveryTimeMax: 10,
    revisions: 3,
    averageRating: 4.7,
    totalReviews: 35,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    updatedAt: Date.now() - 25 * 24 * 60 * 60 * 1000, // 25 days ago
    tags: ["Python", "TensorFlow", "AI"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=Machine+Learning",
        imageTag: "ML Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level machine learning service for those with simple needs and limited budget.",
        price: 150,
        deliveryDays: 10,
        revisions: 1,
        features: ["Basic consultation", "Standard machine learning", "1 concept/draft", "Source files"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete machine learning solution with additional features and priority support.",
        price: 300,
        deliveryDays: 7,
        revisions: 3,
        features: [
          "Everything in Basic",
          "In-depth consultation",
          "Advanced machine learning",
          "3 concepts/drafts",
          "Source files",
          "Commercial use rights",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium machine learning service with all features, fastest delivery, and VIP support.",
        price: 450,
        deliveryDays: 5,
        revisions: 5,
        features: [
          "Everything in Standard",
          "Priority support",
          "VIP consultation",
          "Premium machine learning",
          "5 concepts/drafts",
          "Source files",
          "Commercial use rights",
          "Express delivery",
          "30 days support",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-4",
    title: "Premium DevOps Engineer (AWS, GCP, Azure)",
    description:
      "I'll create professional cloud services that elevate your infrastructure with unlimited revisions until you're satisfied.",
    category: "CloudServices",
    subcategory: "DevOps Engineer (AWS, GCP, Azure)",
    freelancerId: "freelancer-1",
    startingPrice: 125,
    currency: "ETH",
    deliveryTimeMin: 4,
    deliveryTimeMax: 8,
    revisions: 3,
    averageRating: 4.6,
    totalReviews: 22,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    tags: ["AWS", "DevOps", "Cloud"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=DevOps+Engineering",
        imageTag: "DevOps Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level cloud services for those with simple needs and limited budget.",
        price: 125,
        deliveryDays: 8,
        revisions: 1,
        features: ["Basic consultation", "Standard DevOps setup", "1 concept/draft", "Documentation"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete cloud services solution with additional features and priority support.",
        price: 250,
        deliveryDays: 6,
        revisions: 3,
        features: [
          "Everything in Basic",
          "In-depth consultation",
          "Advanced DevOps setup",
          "3 concepts/drafts",
          "Documentation",
          "1 week support",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium cloud services with all features, fastest delivery, and VIP support.",
        price: 375,
        deliveryDays: 4,
        revisions: 5,
        features: [
          "Everything in Standard",
          "Priority support",
          "VIP consultation",
          "Premium DevOps setup",
          "5 concepts/drafts",
          "Comprehensive documentation",
          "Express delivery",
          "30 days support",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-5",
    title: "Professional QA Tester (Manual & Automation)",
    description:
      "I'll provide professional software testing that ensures your application quality with detailed reports and recommendations.",
    category: "SoftwareTesting",
    subcategory: "QA Tester (Manual & Automation)",
    freelancerId: "freelancer-2",
    startingPrice: 80,
    currency: "ETH",
    deliveryTimeMin: 3,
    deliveryTimeMax: 7,
    revisions: 2,
    averageRating: 4.5,
    totalReviews: 18,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    tags: ["QA", "Testing", "Automation"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=QA+Testing",
        imageTag: "QA Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level software testing for those with simple needs and limited budget.",
        price: 80,
        deliveryDays: 7,
        revisions: 1,
        features: ["Basic manual testing", "Bug reporting", "1 test cycle", "Basic test documentation"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete software testing solution with additional features and priority support.",
        price: 160,
        deliveryDays: 5,
        revisions: 2,
        features: [
          "Everything in Basic",
          "Manual and basic automation",
          "Detailed bug reporting",
          "2 test cycles",
          "Comprehensive test documentation",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium software testing with all features, fastest delivery, and VIP support.",
        price: 240,
        deliveryDays: 3,
        revisions: 3,
        features: [
          "Everything in Standard",
          "Priority support",
          "Advanced automation testing",
          "3 test cycles",
          "Performance testing",
          "Security testing",
          "Comprehensive test documentation",
          "Test strategy consultation",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-6",
    title: "Custom API Documentation Writer Service",
    description:
      "I'll create professional technical documentation that makes your API accessible and easy to understand for developers.",
    category: "TechnicalWriting",
    subcategory: "API Documentation Writer",
    freelancerId: "freelancer-3",
    startingPrice: 60,
    currency: "ETH",
    deliveryTimeMin: 2,
    deliveryTimeMax: 5,
    revisions: 3,
    averageRating: 4.9,
    totalReviews: 25,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000, // 25 days ago
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    tags: ["Documentation", "API", "Technical Writing"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=API+Documentation",
        imageTag: "Documentation Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level technical writing for those with simple needs and limited budget.",
        price: 60,
        deliveryDays: 5,
        revisions: 1,
        features: ["Basic API documentation", "Up to 10 endpoints", "Standard formatting", "One revision"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete technical writing solution with additional features and priority support.",
        price: 120,
        deliveryDays: 3,
        revisions: 2,
        features: [
          "Everything in Basic",
          "Up to 25 endpoints",
          "Interactive examples",
          "Error handling documentation",
          "Two revisions",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium technical writing with all features, fastest delivery, and VIP support.",
        price: 180,
        deliveryDays: 2,
        revisions: 3,
        features: [
          "Everything in Standard",
          "Unlimited endpoints",
          "Interactive examples",
          "Error handling documentation",
          "Authentication documentation",
          "Best practices section",
          "Three revisions",
          "Express delivery",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-7",
    title: "Expert SQL Developer Solutions",
    description:
      "I'll create professional database solutions that optimize your data storage and retrieval with best practices implementation.",
    category: "Database",
    subcategory: "SQL Developer",
    freelancerId: "freelancer-1",
    startingPrice: 90,
    currency: "ETH",
    deliveryTimeMin: 3,
    deliveryTimeMax: 7,
    revisions: 2,
    averageRating: 4.7,
    totalReviews: 30,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    tags: ["SQL", "Database", "PostgreSQL"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=SQL+Development",
        imageTag: "SQL Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level database development for those with simple needs and limited budget.",
        price: 90,
        deliveryDays: 7,
        revisions: 1,
        features: ["Basic database design", "Up to 10 tables", "Basic queries", "One revision"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete database solution with additional features and priority support.",
        price: 180,
        deliveryDays: 5,
        revisions: 2,
        features: [
          "Everything in Basic",
          "Up to 25 tables",
          "Optimized queries",
          "Stored procedures",
          "Indexing strategy",
          "Two revisions",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium database development with all features, fastest delivery, and VIP support.",
        price: 270,
        deliveryDays: 3,
        revisions: 3,
        features: [
          "Everything in Standard",
          "Unlimited tables",
          "Advanced optimization",
          "Stored procedures",
          "Triggers",
          "Indexing strategy",
          "Performance tuning",
          "Three revisions",
          "Express delivery",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
  {
    id: "service-8",
    title: "Professional Python Automation Scripts",
    description:
      "I'll create professional automation scripts that save you time and streamline your workflows with reliable execution.",
    category: "AutomationAndScripting",
    subcategory: "Python Automation Scripts",
    freelancerId: "freelancer-2",
    startingPrice: 70,
    currency: "ETH",
    deliveryTimeMin: 2,
    deliveryTimeMax: 6,
    revisions: 3,
    averageRating: 4.8,
    totalReviews: 22,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    tags: ["Python", "Automation", "Scripting"],
    attachments: [
      {
        imageUrl: "/placeholder.svg?height=300&width=500&text=Python+Automation",
        imageTag: "Automation Sample 1",
      },
    ],
    tiers: [
      {
        id: "basic",
        name: "Basic",
        description: "Entry-level automation scripting for those with simple needs and limited budget.",
        price: 70,
        deliveryDays: 6,
        revisions: 1,
        features: ["Basic automation script", "Single task automation", "Basic documentation", "One revision"],
      },
      {
        id: "standard",
        name: "Standard",
        description: "Complete automation solution with additional features and priority support.",
        price: 140,
        deliveryDays: 4,
        revisions: 2,
        features: [
          "Everything in Basic",
          "Multi-task automation",
          "Error handling",
          "Logging",
          "Comprehensive documentation",
          "Two revisions",
        ],
      },
      {
        id: "premium",
        name: "Premium",
        description: "Premium automation scripting with all features, fastest delivery, and VIP support.",
        price: 210,
        deliveryDays: 2,
        revisions: 3,
        features: [
          "Everything in Standard",
          "Complex workflow automation",
          "Advanced error handling",
          "Logging and monitoring",
          "Email notifications",
          "Scheduling capabilities",
          "Comprehensive documentation",
          "Three revisions",
          "Express delivery",
        ],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  },
]

// Sample freelancers data
export const freelancers = [
  {
    id: "freelancer-1",
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    dateOfBirth: "1990-05-15",
    balance: 2.5,
    profilePictureUrl: "/placeholder.svg?text=AJ",
    orderedServicesId: [],
    role: "FREELANCER",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    portfolioIds: ["portfolio-1", "portfolio-2"],
    reputationScore: 4.8,
    completedProjects: 42,
    tokenRewards: 150,
    availabilityStatus: "Available",
  },
  {
    id: "freelancer-2",
    fullName: "Samantha Lee",
    email: "samantha.lee@example.com",
    dateOfBirth: "1988-09-23",
    balance: 3.8,
    profilePictureUrl: "/placeholder.svg?text=SL",
    orderedServicesId: [],
    role: "FREELANCER",
    skills: ["React Native", "iOS", "Android", "Firebase", "UI/UX"],
    portfolioIds: ["portfolio-3", "portfolio-4"],
    reputationScore: 4.9,
    completedProjects: 28,
    tokenRewards: 220,
    availabilityStatus: "Available",
  },
  {
    id: "freelancer-3",
    fullName: "Miguel Rodriguez",
    email: "miguel.rodriguez@example.com",
    dateOfBirth: "1992-03-10",
    balance: 1.7,
    profilePictureUrl: "/placeholder.svg?text=MR",
    orderedServicesId: [],
    role: "FREELANCER",
    skills: ["UI/UX Design", "Figma", "Adobe XD", "Sketch", "Prototyping"],
    portfolioIds: ["portfolio-5", "portfolio-6"],
    reputationScore: 4.7,
    completedProjects: 35,
    tokenRewards: 180,
    availabilityStatus: "Busy",
  },
]

// Sample clients data
export const clients = [
  {
    id: "client-1",
    fullName: "Emily Chen",
    email: "emily.chen@example.com",
    dateOfBirth: "1985-11-08",
    balance: 5.0,
    profilePictureUrl: "/placeholder.svg?text=EC",
    orderedServicesId: ["order-1", "order-3"],
    role: "CLIENT",
  },
  {
    id: "client-2",
    fullName: "David Wilson",
    email: "david.wilson@example.com",
    dateOfBirth: "1990-07-22",
    balance: 3.2,
    profilePictureUrl: "/placeholder.svg?text=DW",
    orderedServicesId: ["order-2"],
    role: "CLIENT",
  },
]

// Sample portfolio items
export const portfolioItems = [
  {
    id: "portfolio-1",
    freelancerId: "freelancer-1",
    title: "AI-Powered Web Application Development",
    description: "A full-featured e-commerce platform built with Next.js and Stripe integration.",
    category: "WebDevelopment",
    images: ["/placeholder.svg?height=300&width=500&text=E-commerce+Website"],
    link: "https://example.com/ecommerce",
  },
  {
    id: "portfolio-2",
    freelancerId: "freelancer-1",
    title: "Cloud Infrastructure Setup & Optimization",
    description: "A comprehensive dashboard for a SaaS application with real-time data visualization.",
    category: "CloudServices",
    images: ["/placeholder.svg?height=300&width=500&text=SaaS+Dashboard"],
    link: "https://example.com/dashboard",
  },
  {
    id: "portfolio-3",
    freelancerId: "freelancer-2",
    title: "End-to-End Mobile App Development",
    description: "A cross-platform mobile app for tracking workouts and nutrition.",
    category: "MobileDevelopment",
    images: ["/placeholder.svg?height=300&width=500&text=Fitness+App"],
    link: "https://example.com/fitness-app",
  },
  {
    id: "portfolio-4",
    freelancerId: "freelancer-2",
    title: "Custom Dashboard for Data Analytics",
    description: "A food delivery application with real-time order tracking and payment processing.",
    category: "MachineLearning",
    images: ["/placeholder.svg?height=300&width=500&text=Food+Delivery+App"],
    link: "https://example.com/food-app",
  },
  {
    id: "portfolio-5",
    freelancerId: "freelancer-3",
    title: "Automation Script for Business Workflow",
    description: "A complete redesign of a banking application focusing on usability and accessibility.",
    category: "AutomationAndScripting",
    images: ["/placeholder.svg?height=300&width=500&text=Banking+App+Design"],
    link: "https://example.com/banking-design",
  },
  {
    id: "portfolio-6",
    freelancerId: "freelancer-3",
    title: "API Development & Integration Services",
    description: "A comprehensive UI kit for travel and booking platforms with over 200 components.",
    category: "WebDevelopment",
    images: ["/placeholder.svg?height=300&width=500&text=Travel+UI+Kit"],
    link: "https://example.com/travel-ui",
  },
]

// Sample orders data
export const orders = [
  {
    id: "order-1",
    clientId: "client-1",
    freelancerId: "freelancer-1",
    serviceId: "service-1",
    packageId: "standard",
    jobStatus: "Completed",
    price: 150,
    currency: "ETH",
    createdAt: new Date("2023-05-10"),
    deliveryDeadline: new Date("2023-05-15"),
    completedAt: new Date("2023-05-14"),
  },
  {
    id: "order-2",
    clientId: "client-2",
    freelancerId: "freelancer-2",
    serviceId: "service-2",
    packageId: "basic",
    jobStatus: "InProgress",
    price: 100,
    currency: "ETH",
    createdAt: new Date("2023-06-05"),
    deliveryDeadline: new Date("2023-06-12"),
  },
  {
    id: "order-3",
    clientId: "client-1",
    freelancerId: "freelancer-3",
    serviceId: "service-3",
    packageId: "premium",
    jobStatus: "Delivered",
    price: 450,
    currency: "ETH",
    createdAt: new Date("2023-06-20"),
    deliveryDeadline: new Date("2023-06-25"),
    deliveredAt: new Date("2023-06-24"),
  },
]

// Sample reviews data
export const reviews = [
  {
    id: "review-1",
    orderId: "order-1",
    clientId: "client-1",
    freelancerId: "freelancer-1",
    serviceId: "service-1",
    rating: 5,
    comment: "Excellent work! The website exceeded my expectations and was delivered ahead of schedule.",
    createdAt: new Date("2023-05-16"),
    freelancerResponse : "ok"
  },
  {
    id: "review-2",
    orderId: "order-3",
    clientId: "client-1",
    freelancerId: "freelancer-3",
    serviceId: "service-3",
    rating: 4,
    comment: "Great designs, very professional. Would have liked a bit more explanation of the design choices.",
    createdAt: new Date("2023-06-26"),
    freelancerResponse : "ok"
  },
]

// Helper functions to get data
export const getServiceById = (id: string) => {
  return services.find((service) => service.id === id)
}

export const getFreelancerById = (id: string) => {
  return freelancers.find((freelancer) => freelancer.id === id)
}

export const getClientById = (id: string) => {
  return clients.find((client) => client.id === id)
}

export const getServicesByFreelancer = (freelancerId: string) => {
  return services.filter((service) => service.freelancerId === freelancerId)
}

export const getReviewsForService = (serviceId: string) => {
  return reviews.filter((review) => review.serviceId === serviceId)
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

// Define the listing type for user-created listings
export interface Listing {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  price: number
  currency: string
  active: boolean
  createdAt: Date
  freelancerId: string
  attachments?: {
    id: string
    imageUrl: string
    type: string
  }[]
  averageRating?: number
  totalReviews: number
}

// Function to convert user listings to service format
export const convertListingToService = (listing: Listing): (typeof services)[0] => {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    subcategory: listing.subcategory || "Other",
    freelancerId: listing.freelancerId || "freelancer-1", // Default to first freelancer if not specified
    startingPrice: listing.price,
    currency: listing.currency || "ETH",
    deliveryTimeMin: 3,
    deliveryTimeMax: 7,
    revisions: 2,
    averageRating: listing.averageRating || 0,
    totalReviews: listing.totalReviews || 0,
    createdAt: listing.createdAt.getTime(),
    updatedAt: listing.createdAt.getTime(),
    tags: [listing.category],
    attachments: listing.attachments
      ? listing.attachments.map((att) => ({
          imageUrl: att.imageUrl,
          imageTag: att.type,
        }))
      : [
          {
            imageUrl: "/placeholder.svg?height=300&width=500&text=New+Listing",
            imageTag: "New Listing",
          },
        ],
    tiers: [
      {
        id: `basic-${listing.id}`,
        name: "Basic",
        description: "Basic package",
        price: listing.price,
        deliveryDays: 3,
        revisions: 1,
        features: ["Basic service"],
      },
      {
        id: `standard-${listing.id}`,
        name: "Standard",
        description: "Standard package with more features",
        price: listing.price * 2,
        deliveryDays: 2,
        revisions: 2,
        features: ["Basic service", "Additional features", "Faster delivery"],
      },
      {
        id: `premium-${listing.id}`,
        name: "Premium",
        description: "Premium package with all features",
        price: listing.price * 3,
        deliveryDays: 1,
        revisions: 3,
        features: ["All features", "Priority support", "Express delivery", "Additional revisions"],
      },
    ],
    status: "InProgress",
    contractType: "FixedPrice",
    paymentMethod: "Escrow",
  }
}

// Function to get all services including user listings
export const getAllServices = () => {
  // Get user listings from localStorage
  const userListingsJson = localStorage.getItem("userListings")
  if (!userListingsJson) return services

  try {
    const userListings: Listing[] = JSON.parse(userListingsJson).map((listing: any) => ({
      ...listing,
      createdAt: new Date(listing.createdAt),
    }))

    // Convert user listings to service format
    const userServices = userListings.map(convertListingToService)

    // Combine with predefined services
    return [...services, ...userServices]
  } catch (error) {
    console.error("Error parsing user listings:", error)
    return services
  }
}
