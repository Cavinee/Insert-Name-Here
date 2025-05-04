// User role types
export enum UserRole {
    CLIENT = "CLIENT",
    FREELANCER = "FREELANCER",
  }
  
  export enum AvailabilityStatus {
    AVAILABLE = "Available",
    BUSY = "Busy",
    ON_VACATION = "On Vacation",
    UNAVAILABLE = "Unavailable",
  }
  
  // Base user profile with common fields
  export interface BaseProfile {
    id: string // Principal in the backend
    role: UserRole
    fullName: string
    email: string
    dateOfBirth: string
    balance: number
    profilePictureUrl: string
    orderedServicesId: string[] // Principal[] in the backend
  }
  
  // Client profile
  export interface ClientProfile extends BaseProfile {
    role: UserRole.CLIENT
  }
  
  // Freelancer profile with additional fields
  export interface FreelancerProfile extends BaseProfile {
    role: UserRole.FREELANCER
    skills: string[]
    portfolioIds?: string[] // Optional: Not all freelancers have a portfolio yet
    reputationScore: number // Based on reviews, orders, etc.
    completedProjects: number
    tokenRewards: number // For gamification or loyalty points
    availabilityStatus: AvailabilityStatus
  }
  
  // Type guard to check if a profile is a FreelancerProfile
  export function isFreelancerProfile(profile: BaseProfile): profile is FreelancerProfile {
    return profile.role === UserRole.FREELANCER
  }
  
  // Registration form data
  export interface RegistrationData {
    fullName: string
    email: string
    dateOfBirth: string
    password: string
    role: UserRole
    skills?: string[] // Only for freelancers
    availabilityStatus?: AvailabilityStatus // Only for freelancers
  }
  