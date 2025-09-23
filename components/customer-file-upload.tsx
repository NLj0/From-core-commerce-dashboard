"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CustomField {
  id: string
  type: "text" | "textarea" | "image" | "dropdown"
  label: string
  required: boolean
  options?: string[]
}

interface CustomerFile {
  id: string
  file: File
  url: string
  name: string
}

interface CustomerFileUploadProps {
  customFields: CustomField[]
  onFieldsChange: (fields: Record<string, any>) => void
  onFilesChange: (files: CustomerFile[]) => void
  productName: string
}

export function CustomerFileUpload({
  customFields,
  onFieldsChange,
  onFilesChange,
  productName,
}: CustomerFileUploadProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({})
  const [uploadedFiles, setUploadedFiles] = useState<CustomerFile[]>([])
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateFileUpload = (files: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = []
    const errors: string[] = []
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (uploadedFiles.length + imageFiles.length > 3) {
      errors.push(`Maximum 3 images allowed per order. You can upload ${3 - uploadedFiles.length} more images.`)
      return { valid: [], errors }
    }

    Array.from(files).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`File ${file.name} exceeds 10MB limit.`)
        return
      }

      validFiles.push(file)
    })

    return { valid: validFiles, errors }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const { valid, errors } = validateFileUpload(files)
    setUploadErrors(errors)

    if (valid.length > 0) {
      const newFiles: CustomerFile[] = valid.map((file, index) => ({
        id: Date.now().toString() + index,
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }))

      const updatedFiles = [...uploadedFiles, ...newFiles]
      setUploadedFiles(updatedFiles)
      onFilesChange(updatedFiles)
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setUploadErrors([])
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    const updatedValues = { ...fieldValues, [fieldId]: value }
    setFieldValues(updatedValues)
    onFieldsChange(updatedValues)
  }

  const validateFields = () => {
    const errors: string[] = []

    customFields.forEach((field) => {
      if (field.required && (!fieldValues[field.id] || fieldValues[field.id].toString().trim() === "")) {
        errors.push(`${field.label} is required`)
      }
    })

    // Check image upload requirements
    const imageFields = customFields.filter((f) => f.type === "image")
    imageFields.forEach((field) => {
      if (field.required && uploadedFiles.length === 0) {
        errors.push(`${field.label} is required - please upload at least one image`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  const renderField = (field: CustomField) => {
    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              value={fieldValues[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        )

      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={fieldValues[field.id] || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              rows={4}
              required={field.required}
            />
          </div>
        )

      case "dropdown":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={fieldValues[field.id] || ""}
              onValueChange={(value) => handleFieldChange(field.id, value)}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "image":
        return (
          <div key={field.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Badge variant="outline">{uploadedFiles.length}/3</Badge>
            </div>

            {uploadErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {uploadErrors.map((error, index) => (
                      <p key={index}>• {error}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload files for your order (Max 3 images, 10MB each)
              </p>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                id={`file-upload-${field.id}`}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`file-upload-${field.id}`)?.click()}
                disabled={uploadedFiles.length >= 3}
              >
                Choose Files
              </Button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files</Label>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.file.size / (1024 * 1024)).toFixed(1)}MB
                      </Badge>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>File Upload Limit:</strong> Maximum 3 images per order. This helps us process your request
                efficiently.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Additional Information Required</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Please provide the following information for your {productName} order:
        </p>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following errors:</p>
              {validationErrors.map((error, index) => (
                <p key={index}>• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">{customFields.map(renderField)}</div>

      {customFields.length > 0 && (
        <div className="border-t pt-4">
          <Button type="button" onClick={validateFields} className="w-full">
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate Information
          </Button>
        </div>
      )}
    </div>
  )
}
