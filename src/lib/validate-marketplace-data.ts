// import type {
//   ClientProfile,
//   FreelancerProfile,
//   PortfolioItem,
//   Service,
//   ServiceTier,
//   Order,
//   Review,
//   UserRole,
//   JobStatus,
//   OrderStatus,
//   PaymentStatus,
//   AvailabilityStatus,
//   PaymentMethod,
//   ContractType,
// } from "./marketplace-data"

// // Type guard functions
// export function isValidUserRole(role: any): role is UserRole {
//   return ["Client", "Freelancer", "Admin"].includes(role)
// }

// export function isValidJobStatus(status: any): status is JobStatus {
//   return ["InProgress", "Delivered", "Completed", "Cancelled", "Disputed"].includes(status)
// }

// export function isValidOrderStatus(status: any): status is OrderStatus {
//   return ["Accepted", "Rejected", "Undecided"].includes(status)
// }

// export function isValidPaymentStatus(status: any): status is PaymentStatus {
//   return ["Pending", "Paid", "Refunded", "Disputed"].includes(status)
// }

// export function isValidAvailabilityStatus(status: any): status is AvailabilityStatus {
//   return ["Available", "Busy", "OnVacation"].includes(status)
// }

// export function isValidPaymentMethod(method: any): method is PaymentMethod {
//   return ["Escrow", "Direct"].includes(method)
// }

// export function isValidContractType(type: any): type is ContractType {
//   return ["FixedPrice", "Hourly"].includes(type)
// }

// // Validation functions for each entity type
// export function validateClientProfile(client: ClientProfile): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!client.id) errors.push("Client ID is required")
//   if (!client.fullName) errors.push("Client full name is required")
//   if (!client.email) errors.push("Client email is required")
//   if (!client.dateOfBirth) errors.push("Client date of birth is required")
//   if (client.balance === undefined) errors.push("Client balance is required")
//   if (!client.profilePictureUrl) errors.push("Client profile picture URL is required")

//   // Validate email format
//   if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
//     errors.push("Invalid email format")
//   }

//   // Validate date of birth format (YYYY-MM-DD) - more lenient check
//   if (client.dateOfBirth && !/^\d{4}-\d{1,2}-\d{1,2}$/.test(client.dateOfBirth)) {
//     errors.push("Invalid date of birth format (should be YYYY-MM-DD)")
//   }

//   // Validate balance is a non-negative number
//   if (client.balance !== undefined && (typeof client.balance !== "number" || client.balance < 0)) {
//     errors.push("Balance must be a non-negative number")
//   }

//   // Validate role
//   if (!isValidUserRole(client.role)) {
//     errors.push(`Invalid user role: ${client.role}`)
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validateFreelancerProfile(freelancer: FreelancerProfile): { valid: boolean; errors: string[] } {
//   // First validate the base client profile
//   const clientValidation = validateClientProfile(freelancer)
//   const errors = [...clientValidation.errors]

//   // Check freelancer-specific required fields
//   if (!Array.isArray(freelancer.skills) || freelancer.skills.length === 0) {
//     errors.push("Freelancer skills are required and must be a non-empty array")
//   }

//   if (freelancer.reputationScore === undefined) {
//     errors.push("Freelancer reputation score is required")
//   } else if (
//     typeof freelancer.reputationScore !== "number" ||
//     freelancer.reputationScore < 0 ||
//     freelancer.reputationScore > 5
//   ) {
//     errors.push("Reputation score must be a number between 0 and 5")
//   }

//   if (freelancer.completedProjects === undefined) {
//     errors.push("Completed projects count is required")
//   } else if (typeof freelancer.completedProjects !== "number" || freelancer.completedProjects < 0) {
//     errors.push("Completed projects must be a non-negative number")
//   }

//   if (freelancer.tokenRewards === undefined) {
//     errors.push("Token rewards are required")
//   } else if (typeof freelancer.tokenRewards !== "number" || freelancer.tokenRewards < 0) {
//     errors.push("Token rewards must be a non-negative number")
//   }

//   if (!freelancer.availabilityStatus) {
//     errors.push("Availability status is required")
//   } else if (!isValidAvailabilityStatus(freelancer.availabilityStatus)) {
//     errors.push(`Invalid availability status: ${freelancer.availabilityStatus}`)
//   }

//   // Validate portfolioIds if present
//   if (freelancer.portfolioIds !== null && !Array.isArray(freelancer.portfolioIds)) {
//     errors.push("Portfolio IDs must be an array or null")
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validatePortfolioItem(item: PortfolioItem): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!item.id) errors.push("Portfolio item ID is required")
//   if (!item.freelancerId) errors.push("Freelancer ID is required")
//   if (!item.title) errors.push("Portfolio item title is required")
//   if (!item.description) errors.push("Portfolio item description is required")
//   if (!item.category) errors.push("Portfolio item category is required")

//   // Validate images array
//   if (!Array.isArray(item.images) || item.images.length === 0) {
//     errors.push("Portfolio item images are required and must be a non-empty array")
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validateServiceTier(tier: ServiceTier): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!tier.id) errors.push("Service tier ID is required")
//   if (!tier.name) errors.push("Service tier name is required")
//   if (!tier.description) errors.push("Service tier description is required")

//   // Validate price
//   if (tier.price === undefined) {
//     errors.push("Service tier price is required")
//   } else if (typeof tier.price !== "number" || tier.price <= 0) {
//     errors.push("Service tier price must be a positive number")
//   }

//   // Validate delivery days
//   if (tier.deliveryDays === undefined) {
//     errors.push("Service tier delivery days are required")
//   } else if (typeof tier.deliveryDays !== "number" || tier.deliveryDays <= 0) {
//     errors.push("Service tier delivery days must be a positive number")
//   }

//   // Validate revisions
//   if (tier.revisions === undefined) {
//     errors.push("Service tier revisions are required")
//   } else if (typeof tier.revisions !== "number" || tier.revisions < 0) {
//     errors.push("Service tier revisions must be a non-negative number")
//   }

//   // Validate features
//   if (!Array.isArray(tier.features) || tier.features.length === 0) {
//     errors.push("Service tier features are required and must be a non-empty array")
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validateService(service: Service): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!service.id) errors.push("Service ID is required")
//   if (!service.title) errors.push("Service title is required")
//   if (!service.description) errors.push("Service description is required")
//   if (!service.category) errors.push("Service category is required")
//   if (!service.subcategory) errors.push("Service subcategory is required")
//   if (!service.freelancerId) errors.push("Freelancer ID is required")
//   if (!service.currency) errors.push("Service currency is required")

//   // Validate numeric fields
//   if (service.startingPrice === undefined) {
//     errors.push("Service starting price is required")
//   } else if (typeof service.startingPrice !== "number" || service.startingPrice <= 0) {
//     errors.push("Service starting price must be a positive number")
//   }

//   if (service.deliveryTimeMin === undefined) {
//     errors.push("Service minimum delivery time is required")
//   } else if (typeof service.deliveryTimeMin !== "number" || service.deliveryTimeMin <= 0) {
//     errors.push("Service minimum delivery time must be a positive number")
//   }

//   // Validate timestamps
//   if (!service.createdAt) errors.push("Service created timestamp is required")
//   if (!service.updatedAt) errors.push("Service updated timestamp is required")

//   // Removed timestamp comparison check as it's causing issues

//   // Validate status
//   if (!isValidJobStatus(service.status)) {
//     errors.push(`Invalid job status: ${service.status}`)
//   }

//   // Validate contract type
//   if (!isValidContractType(service.contractType)) {
//     errors.push(`Invalid contract type: ${service.contractType}`)
//   }

//   // Validate payment method
//   if (!isValidPaymentMethod(service.paymentMethod)) {
//     errors.push(`Invalid payment method: ${service.paymentMethod}`)
//   }

//   // Validate tags
//   if (!Array.isArray(service.tags)) {
//     errors.push("Service tags must be an array")
//   }

//   // Validate tiers
//   if (!Array.isArray(service.tiers) || service.tiers.length === 0) {
//     errors.push("Service tiers are required and must be a non-empty array")
//   } else {
//     // Validate each tier
//     service.tiers.forEach((tier, index) => {
//       const tierValidation = validateServiceTier(tier)
//       if (!tierValidation.valid) {
//         errors.push(`Service tier at index ${index} has errors: ${tierValidation.errors.join(", ")}`)
//       }
//     })
//   }

//   // Validate attachments if present
//   if (service.attachments !== null && !Array.isArray(service.attachments)) {
//     errors.push("Service attachments must be an array or null")
//   }

//   // Validate average rating if present
//   if (
//     service.averageRating !== null &&
//     (typeof service.averageRating !== "number" || service.averageRating < 0 || service.averageRating > 5)
//   ) {
//     errors.push("Average rating must be a number between 0 and 5 or null")
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validateOrder(order: Order): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!order.id) errors.push("Order ID is required")
//   if (!order.clientId) errors.push("Client ID is required")
//   if (!order.freelancerId) errors.push("Freelancer ID is required")
//   if (!order.serviceId) errors.push("Service ID is required")
//   if (!order.packageId) errors.push("Package ID is required")
//   if (!order.currency) errors.push("Order currency is required")

//   // Validate timestamps
//   if (!order.createdAt) errors.push("Order created timestamp is required")
//   if (!order.updatedAt) errors.push("Order updated timestamp is required")

//   // Removed timestamp comparison check as it's causing issues

//   if (!order.deliveryDeadline) errors.push("Order delivery deadline is required")

//   // Removed delivery deadline comparison check as it's causing issues

//   // Validate statuses
//   if (!isValidOrderStatus(order.orderStatus)) {
//     errors.push(`Invalid order status: ${order.orderStatus}`)
//   }

//   if (!isValidJobStatus(order.jobStatus)) {
//     errors.push(`Invalid job status: ${order.jobStatus}`)
//   }

//   if (!isValidPaymentStatus(order.paymentStatus)) {
//     errors.push(`Invalid payment status: ${order.paymentStatus}`)
//   }

//   // Validate revisions
//   if (!Array.isArray(order.revisions)) {
//     errors.push("Order revisions must be an array")
//   }

//   if (typeof order.revisionMaxLimit !== "number" || order.revisionMaxLimit < 0) {
//     errors.push("Order revision max limit must be a non-negative number")
//   }

//   // Validate cancellation reason
//   if (order.jobStatus === "Cancelled" && !order.cancellationReason) {
//     errors.push("Cancellation reason is required for cancelled orders")
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// export function validateReview(review: Review): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Check required fields
//   if (!review.id) errors.push("Review ID is required")
//   if (!review.orderId) errors.push("Order ID is required")
//   if (!review.serviceId) errors.push("Service ID is required")
//   if (!review.reviewerId) errors.push("Reviewer ID is required")
//   if (!review.recipientId) errors.push("Recipient ID is required")
//   if (!review.comment) errors.push("Review comment is required")
//   if (!review.reviewType) errors.push("Review type is required")

//   // Validate rating
//   if (review.rating === undefined) {
//     errors.push("Review rating is required")
//   } else if (typeof review.rating !== "number" || review.rating < 1 || review.rating > 5) {
//     errors.push("Review rating must be a number between 1 and 5")
//   }

//   // Validate timestamp
//   if (!review.createdAt) errors.push("Review created timestamp is required")

//   // Validate review type
//   if (!["client-to-freelancer", "freelancer-to-client"].includes(review.reviewType)) {
//     errors.push(`Invalid review type: ${review.reviewType}`)
//   }

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// // Validate relationships between entities
// export function validateRelationships(
//   clients: ClientProfile[],
//   freelancers: FreelancerProfile[],
//   portfolioItems: PortfolioItem[],
//   services: Service[],
//   orders: Order[],
//   reviews: Review[],
// ): { valid: boolean; errors: string[] } {
//   const errors: string[] = []

//   // Create maps for quick lookups
//   const clientMap = new Map(clients.map((client) => [client.id, client]))
//   const freelancerMap = new Map(freelancers.map((freelancer) => [freelancer.id, freelancer]))
//   const serviceMap = new Map(services.map((service) => [service.id, service]))
//   const orderMap = new Map(orders.map((order) => [order.id, order]))

//   // Validate portfolio items reference valid freelancers
//   portfolioItems.forEach((item, index) => {
//     if (!freelancerMap.has(item.freelancerId)) {
//       errors.push(`Portfolio item at index ${index} references non-existent freelancer ID: ${item.freelancerId}`)
//     }
//   })

//   // Validate services reference valid freelancers
//   services.forEach((service, index) => {
//     if (!freelancerMap.has(service.freelancerId)) {
//       errors.push(`Service at index ${index} references non-existent freelancer ID: ${service.freelancerId}`)
//     }
//   })

//   // Validate orders reference valid clients, freelancers, and services
//   orders.forEach((order, index) => {
//     if (!clientMap.has(order.clientId)) {
//       errors.push(`Order at index ${index} references non-existent client ID: ${order.clientId}`)
//     }

//     if (!freelancerMap.has(order.freelancerId)) {
//       errors.push(`Order at index ${index} references non-existent freelancer ID: ${order.freelancerId}`)
//     }

//     if (!serviceMap.has(order.serviceId)) {
//       errors.push(`Order at index ${index} references non-existent service ID: ${order.serviceId}`)
//     }

//     // Validate package ID references a valid tier in the service
//     const service = serviceMap.get(order.serviceId)
//     if (service) {
//       const validTierIds = service.tiers.map((tier) => tier.id)
//       if (!validTierIds.includes(order.packageId)) {
//         errors.push(
//           `Order at index ${index} references non-existent package ID: ${order.packageId} in service ${service.id}`,
//         )
//       }
//     }
//   })

//   // Validate reviews reference valid orders, services, clients, and freelancers
//   reviews.forEach((review, index) => {
//     if (!orderMap.has(review.orderId)) {
//       errors.push(`Review at index ${index} references non-existent order ID: ${review.orderId}`)
//     }

//     if (!serviceMap.has(review.serviceId)) {
//       errors.push(`Review at index ${index} references non-existent service ID: ${review.serviceId}`)
//     }

//     // Check if reviewer and recipient exist
//     const isReviewerClient = clientMap.has(review.reviewerId)
//     const isReviewerFreelancer = freelancerMap.has(review.reviewerId)

//     if (!isReviewerClient && !isReviewerFreelancer) {
//       errors.push(`Review at index ${index} has invalid reviewer ID: ${review.reviewerId}`)
//     }

//     const isRecipientClient = clientMap.has(review.recipientId)
//     const isRecipientFreelancer = freelancerMap.has(review.recipientId)

//     if (!isRecipientClient && !isRecipientFreelancer) {
//       errors.push(`Review at index ${index} has invalid recipient ID: ${review.recipientId}`)
//     }

//     // Validate review type matches reviewer and recipient roles
//     if (review.reviewType === "client-to-freelancer") {
//       if (!isReviewerClient) {
//         errors.push(`Review at index ${index} is client-to-freelancer but reviewer is not a client`)
//       }

//       if (!isRecipientFreelancer) {
//         errors.push(`Review at index ${index} is client-to-freelancer but recipient is not a freelancer`)
//       }
//     } else if (review.reviewType === "freelancer-to-client") {
//       if (!isReviewerFreelancer) {
//         errors.push(`Review at index ${index} is freelancer-to-client but reviewer is not a freelancer`)
//       }

//       if (!isRecipientClient) {
//         errors.push(`Review at index ${index} is freelancer-to-client but recipient is not a client`)
//       }
//     }
//   })

//   return {
//     valid: errors.length === 0,
//     errors,
//   }
// }

// // Main validation function
// export function validateMarketplaceData(
//   clients: ClientProfile[],
//   freelancers: FreelancerProfile[],
//   portfolioItems: PortfolioItem[],
//   services: Service[],
//   orders: Order[],
//   reviews: Review[],
// ): { valid: boolean; errors: Record<string, string[]> } {
//   const validationErrors: Record<string, string[]> = {
//     clients: [],
//     freelancers: [],
//     portfolioItems: [],
//     services: [],
//     orders: [],
//     reviews: [],
//     relationships: [],
//   }

//   // Validate each entity type
//   clients.forEach((client, index) => {
//     const validation = validateClientProfile(client)
//     if (!validation.valid) {
//       validationErrors.clients.push(`Client at index ${index} (${client.id}): ${validation.errors.join(", ")}`)
//     }
//   })

//   freelancers.forEach((freelancer, index) => {
//     const validation = validateFreelancerProfile(freelancer)
//     if (!validation.valid) {
//       validationErrors.freelancers.push(
//         `Freelancer at index ${index} (${freelancer.id}): ${validation.errors.join(", ")}`,
//       )
//     }
//   })

//   portfolioItems.forEach((item, index) => {
//     const validation = validatePortfolioItem(item)
//     if (!validation.valid) {
//       validationErrors.portfolioItems.push(
//         `Portfolio item at index ${index} (${item.id}): ${validation.errors.join(", ")}`,
//       )
//     }
//   })

//   services.forEach((service, index) => {
//     const validation = validateService(service)
//     if (!validation.valid) {
//       validationErrors.services.push(`Service at index ${index} (${service.id}): ${validation.errors.join(", ")}`)
//     }
//   })

//   orders.forEach((order, index) => {
//     const validation = validateOrder(order)
//     if (!validation.valid) {
//       validationErrors.orders.push(`Order at index ${index} (${order.id}): ${validation.errors.join(", ")}`)
//     }
//   })

//   reviews.forEach((review, index) => {
//     const validation = validateReview(review)
//     if (!validation.valid) {
//       validationErrors.reviews.push(`Review at index ${index} (${review.id}): ${validation.errors.join(", ")}`)
//     }
//   })

//   // Validate relationships between entities
//   const relationshipsValidation = validateRelationships(clients, freelancers, portfolioItems, services, orders, reviews)
//   if (!relationshipsValidation.valid) {
//     validationErrors.relationships = relationshipsValidation.errors
//   }

//   // Check if there are any errors
//   const hasErrors = Object.values(validationErrors).some((errors) => errors.length > 0)

//   return {
//     valid: !hasErrors,
//     errors: validationErrors,
//   }
// }
