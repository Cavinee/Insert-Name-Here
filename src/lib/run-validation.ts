import { clients, freelancers, portfolioItems, services, orders, reviews } from "./marketplace-data"
import { validateMarketplaceData } from "./validate-marketplace-data"

export function runValidation() {
  console.log("Running marketplace data validation...")

  const validationResult = validateMarketplaceData(clients, freelancers, portfolioItems, services, orders, reviews)

  if (validationResult.valid) {
    console.log("✅ All data is valid!")
    return true
  } else {
    console.error("❌ Validation errors found:")

    let totalErrors = 0

    Object.entries(validationResult.errors).forEach(([entityType, errors]) => {
      if (errors.length > 0) {
        console.error(`\n${entityType.toUpperCase()} ERRORS (${errors.length}):`)
        errors.forEach((error) => console.error(`- ${error}`))
        totalErrors += errors.length
      }
    })

    console.error(`\nTotal errors: ${totalErrors}`)
    return false
  }
}

// Run validation if this file is executed directly
if (require.main === module) {
  runValidation()
}
