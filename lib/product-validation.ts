interface ProductImage {
  id: string
  url: string
  file?: File
  isPrimary: boolean
}

interface CustomField {
  id: string
  type: "text" | "textarea" | "image" | "dropdown"
  label: string
  required: boolean
  options?: string[]
}

interface ValidationError {
  field: string
  message: string
  type: "error" | "warning"
}

interface ProductValidationData {
  images: ProductImage[]
  customFields: CustomField[]
  customerFiles?: File[]
}

export class ProductValidator {
  private errors: ValidationError[] = []
  private warnings: ValidationError[] = []

  validate(data: ProductValidationData): { isValid: boolean; errors: ValidationError[]; warnings: ValidationError[] } {
    this.errors = []
    this.warnings = []

    this.validateImages(data.images)
    this.validateCustomFields(data.customFields)
    this.validateCustomerFiles(data.customerFiles || [])

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    }
  }

  private validateImages(images: ProductImage[]): void {
    // Rule: Maximum 10 images per product
    if (images.length > 10) {
      this.errors.push({
        field: "images",
        message: "Maximum 10 images allowed per product",
        type: "error",
      })
    }

    // Rule: Each image must be under 10MB
    images.forEach((image, index) => {
      if (image.file && image.file.size > 10 * 1024 * 1024) {
        this.errors.push({
          field: "images",
          message: `Image ${index + 1} (${image.file.name}) exceeds 10MB limit`,
          type: "error",
        })
      }
    })

    // Warning: No primary image selected
    if (images.length > 0 && !images.some((img) => img.isPrimary)) {
      this.warnings.push({
        field: "images",
        message: "No primary image selected. First image will be used as primary.",
        type: "warning",
      })
    }

    // Warning: Recommend at least 3 images for better presentation
    if (images.length > 0 && images.length < 3) {
      this.warnings.push({
        field: "images",
        message: "Consider adding more images for better product presentation (recommended: 3-5 images)",
        type: "warning",
      })
    }
  }

  private validateCustomFields(customFields: CustomField[]): void {
    const textFields = customFields.filter((f) => f.type === "text")
    const textareaFields = customFields.filter((f) => f.type === "textarea")
    const imageFields = customFields.filter((f) => f.type === "image")
    const dropdownFields = customFields.filter((f) => f.type === "dropdown")

    // Rule: Maximum 7 text fields
    if (textFields.length > 7) {
      this.errors.push({
        field: "customFields",
        message: "Maximum 7 text fields allowed",
        type: "error",
      })
    }

    // Rule: Only 1 textarea allowed
    if (textareaFields.length > 1) {
      this.errors.push({
        field: "customFields",
        message: "Only 1 textarea field allowed",
        type: "error",
      })
    }

    // Rule: Only 1 image upload field allowed
    if (imageFields.length > 1) {
      this.errors.push({
        field: "customFields",
        message: "Only 1 image upload field allowed",
        type: "error",
      })
    }

    // Rule: Only 1 dropdown field allowed
    if (dropdownFields.length > 1) {
      this.errors.push({
        field: "customFields",
        message: "Only 1 dropdown field allowed",
        type: "error",
      })
    }

    // Rule: If using textarea, image, or dropdown, maximum 3 text fields
    const hasSpecialField = textareaFields.length > 0 || imageFields.length > 0 || dropdownFields.length > 0
    if (hasSpecialField && textFields.length > 3) {
      this.errors.push({
        field: "customFields",
        message: "When using Textarea, Image Upload, or Dropdown fields, maximum 3 text fields allowed",
        type: "error",
      })
    }

    // Validate dropdown options
    dropdownFields.forEach((field, index) => {
      if (!field.options || field.options.length < 2) {
        this.errors.push({
          field: "customFields",
          message: `Dropdown field "${field.label}" must have at least 2 options`,
          type: "error",
        })
      }

      if (field.options && field.options.length > 10) {
        this.warnings.push({
          field: "customFields",
          message: `Dropdown field "${field.label}" has many options (${field.options.length}). Consider grouping or reducing options for better user experience.`,
          type: "warning",
        })
      }
    })

    // Validate field labels
    customFields.forEach((field) => {
      if (!field.label || field.label.trim().length === 0) {
        this.errors.push({
          field: "customFields",
          message: `${field.type} field must have a label`,
          type: "error",
        })
      }

      if (field.label && field.label.length > 50) {
        this.warnings.push({
          field: "customFields",
          message: `Field label "${field.label}" is quite long. Consider shortening for better display.`,
          type: "warning",
        })
      }
    })

    // Check for duplicate labels
    const labels = customFields.map((f) => f.label.toLowerCase().trim()).filter(Boolean)
    const duplicateLabels = labels.filter((label, index) => labels.indexOf(label) !== index)
    if (duplicateLabels.length > 0) {
      this.errors.push({
        field: "customFields",
        message: `Duplicate field labels found: ${[...new Set(duplicateLabels)].join(", ")}`,
        type: "error",
      })
    }
  }

  private validateCustomerFiles(customerFiles: File[]): void {
    // Rule: Maximum 3 images per order
    const imageFiles = customerFiles.filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length > 3) {
      this.errors.push({
        field: "customerFiles",
        message: "Maximum 3 images allowed per order",
        type: "error",
      })
    }

    // Rule: Each file must be under 10MB
    customerFiles.forEach((file, index) => {
      if (file.size > 10 * 1024 * 1024) {
        this.errors.push({
          field: "customerFiles",
          message: `File ${index + 1} (${file.name}) exceeds 10MB limit`,
          type: "error",
        })
      }
    })

    // Warning: Large total file size
    const totalSize = customerFiles.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 25 * 1024 * 1024) {
      // 25MB total
      this.warnings.push({
        field: "customerFiles",
        message: `Total file size is ${(totalSize / (1024 * 1024)).toFixed(1)}MB. Large files may take longer to upload.`,
        type: "warning",
      })
    }
  }

  // Static method for quick validation
  static validateProduct(data: ProductValidationData): {
    isValid: boolean
    errors: ValidationError[]
    warnings: ValidationError[]
  } {
    const validator = new ProductValidator()
    return validator.validate(data)
  }

  // Helper method to get validation summary
  static getValidationSummary(errors: ValidationError[], warnings: ValidationError[]): string {
    const errorCount = errors.length
    const warningCount = warnings.length

    if (errorCount === 0 && warningCount === 0) {
      return "All validation checks passed"
    }

    const parts = []
    if (errorCount > 0) {
      parts.push(`${errorCount} error${errorCount > 1 ? "s" : ""}`)
    }
    if (warningCount > 0) {
      parts.push(`${warningCount} warning${warningCount > 1 ? "s" : ""}`)
    }

    return `Found ${parts.join(" and ")}`
  }
}

// Export validation rules as constants for reference
export const VALIDATION_RULES = {
  PRODUCT_IMAGES: {
    MAX_COUNT: 10,
    MAX_SIZE_MB: 10,
    RECOMMENDED_MIN: 3,
  },
  CUSTOM_FIELDS: {
    MAX_TEXT_FIELDS: 7,
    MAX_TEXTAREA_FIELDS: 1,
    MAX_IMAGE_FIELDS: 1,
    MAX_DROPDOWN_FIELDS: 1,
    MAX_TEXT_WITH_SPECIAL: 3,
    MAX_LABEL_LENGTH: 50,
    MIN_DROPDOWN_OPTIONS: 2,
    MAX_DROPDOWN_OPTIONS_WARNING: 10,
  },
  CUSTOMER_FILES: {
    MAX_IMAGES: 3,
    MAX_FILE_SIZE_MB: 10,
    MAX_TOTAL_SIZE_WARNING_MB: 25,
  },
} as const
