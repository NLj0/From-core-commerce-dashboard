"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

interface ValidationError {
  field: string
  message: string
  type: "error" | "warning"
}

interface ValidationDisplayProps {
  errors: ValidationError[]
  warnings: ValidationError[]
  showSummary?: boolean
}

export function ValidationDisplay({ errors, warnings, showSummary = true }: ValidationDisplayProps) {
  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0

  if (!hasErrors && !hasWarnings) {
    return showSummary ? (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          All validation checks passed successfully!
        </AlertDescription>
      </Alert>
    ) : null
  }

  return (
    <div className="space-y-4">
      {showSummary && (
        <div className="flex items-center gap-2">
          <Badge variant={hasErrors ? "destructive" : "secondary"}>
            {hasErrors ? "Validation Failed" : "Validation Passed with Warnings"}
          </Badge>
          {hasErrors && (
            <span className="text-sm text-muted-foreground">
              {errors.length} error{errors.length > 1 ? "s" : ""}
            </span>
          )}
          {hasWarnings && (
            <span className="text-sm text-muted-foreground">
              {warnings.length} warning{warnings.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    • <span className="font-medium">{error.field}:</span> {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-200">
            <div className="space-y-2">
              <p className="font-medium">Recommendations:</p>
              <ul className="space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index} className="text-sm">
                    • <span className="font-medium">{warning.field}:</span> {warning.message}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
