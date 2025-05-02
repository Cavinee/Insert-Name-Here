"use client"
// TODO : CHANGE THIS
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { validateMarketplaceData } from "../lib/validate-marketplace-data"
import { clients, freelancers, portfolioItems, services, orders, reviews } from "../lib/marketplace-data"

export default function ValidatePage() {
  const [validationResult, setValidationResult] = useState<{
    valid: boolean
    errors: Record<string, string[]>
  } | null>(null)

  const [isValidating, setIsValidating] = useState(false)

  const runValidation = () => {
    setIsValidating(true)

    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      const result = validateMarketplaceData(clients, freelancers, portfolioItems, services, orders, reviews)
      setValidationResult(result)
      setIsValidating(false)
    }, 100)
  }

  // Count total errors
  const totalErrors = validationResult
    ? Object.values(validationResult.errors).reduce((sum, errors) => sum + errors.length, 0)
    : 0

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Marketplace Data Validation</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Validation Tool</CardTitle>
          <CardDescription>Validate the marketplace data against the Motoko type definitions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{clients.length}</div>
              <div className="text-sm text-muted-foreground">Clients</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{freelancers.length}</div>
              <div className="text-sm text-muted-foreground">Freelancers</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{portfolioItems.length}</div>
              <div className="text-sm text-muted-foreground">Portfolio Items</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{services.length}</div>
              <div className="text-sm text-muted-foreground">Services</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-muted-foreground">Orders</div>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-2xl font-bold">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
          </div>

          {validationResult && (
            <Alert variant={validationResult.valid ? "default" : "warning"} className="mb-4 border-2 border-current">
              {validationResult.valid ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertTitle>Validation Successful</AlertTitle>
                  <AlertDescription>All data is valid and matches the Motoko type definitions.</AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertTitle>Validation Warnings</AlertTitle>
                  <AlertDescription>
                    Found {totalErrors} warning{totalErrors !== 1 ? "s" : ""} in the marketplace data. These may not
                    affect functionality but should be reviewed.
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          {validationResult && !validationResult.valid && (
            <div className="space-y-4 mt-4">
              {Object.entries(validationResult.errors).map(([entityType, errors]) => {
                if (errors.length === 0) return null

                return (
                  <div key={entityType} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-warning" />
                      {entityType.charAt(0).toUpperCase() + entityType.slice(1)} ({errors.length} warning
                      {errors.length !== 1 ? "s" : ""})
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runValidation} disabled={isValidating}>
            {isValidating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Run Validation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
