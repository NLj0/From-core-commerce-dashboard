"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Save, Search, Globe, AlertCircle, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  image: string
  status: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
  }
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (category: any) => void
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
  const [currentTab, setCurrentTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    descriptionAr: "",
    image: "",
    status: "active",
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        descriptionAr: (category as any).descriptionAr || "",
        image: category.image,
        status: category.status,
        seo: {
          metaTitle: category.seo.metaTitle,
          metaDescription: category.seo.metaDescription,
          keywords: category.seo.keywords,
        },
      })
    } else {
      setFormData({
        name: "",
        description: "",
        descriptionAr: "",
        image: "",
        status: "active",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: "",
        },
      })
    }
    setSubmitError(null)
    setUploadError(null)
  }, [category, open])

  // Security: Validate image before upload
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    // Check file type by extension and MIME type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validMimeTypes.includes(file.type)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP and GIF allowed' }
    }
    
    if (!validExtensions.includes(fileExtension)) {
      return { valid: false, error: 'Invalid file extension' }
    }
    
    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 2MB' }
    }
    
    // Validate file size minimum (10KB)
    const minSize = 10 * 1024 // 10KB
    if (file.size < minSize) {
      return { valid: false, error: 'File too small. Minimum size is 10KB' }
    }
    
    return { valid: true }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate before uploading
    const validation = validateImage(file)
    if (!validation.valid) {
      setUploadError(validation.error || 'Validation failed')
      return
    }

    setIsUploading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const result = await response.json()
      setFormData({ ...formData, image: result.url })
      
      // Clear any previous errors on success
      setUploadError(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadError(errorMessage)
      // Reset image on error
      setFormData(prev => ({ ...prev, image: '' }))
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      if (!formData.name.trim()) {
        setSubmitError("Category name is required")
        setIsSubmitting(false)
        return
      }

      const url = category
        ? `/api/categories/${category.id}`
        : `/api/categories`

      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          descriptionAr: formData.descriptionAr.trim(),
          image: formData.image || null,
          status: formData.status,
          seo: {
            metaTitle: formData.seo.metaTitle.trim(),
            metaDescription: formData.seo.metaDescription.trim(),
            keywords: formData.seo.keywords.trim()
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed to ${category ? 'update' : 'create'} category`)
      }

      const result = await response.json()
      
      // Clear the temporary image since it's now persisted in the database
      setFormData(prev => ({ ...prev, image: '' }))
      
      onSave(result)
      onOpenChange(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSubmitError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSEOPreview = () => {
    const title = formData.seo.metaTitle || formData.name || "Category Title"
    const description =
      formData.seo.metaDescription || formData.description || "Category description will appear here..."
    const url = `https://yourstore.com/categories/${formData.name.toLowerCase().replace(/\s+/g, "-")}`

    return { title, description, url }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="hover:bg-accent">{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category information below." : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionAr">الوصف بالعربية (Arabic Description)</Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="وصف الفئة بالعربية..."
                  rows={3}
                  disabled={isSubmitting}
                  dir="rtl"
                />
              </div>

              <div className="space-y-3">
                <Label>Category Image</Label>
                {uploadError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{uploadError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20 relative overflow-hidden">
                    {formData.image ? (
                      <>
                        <img
                          src={formData.image}
                          alt="Category"
                          className="h-full w-full object-cover"
                        />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                          </div>
                        )}
                      </>
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div>
                      <input
                        type="file"
                        id="image-input"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleImageUpload}
                        disabled={isSubmitting || isUploading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('image-input')?.click()}
                        disabled={isSubmitting || isUploading}
                        className="w-full"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting || isUploading}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        Remove Image
                      </Button>
                    )}
                    <div className="text-xs text-muted-foreground">PNG, JPG, WebP up to 2MB. Recommended: 400x400px</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.seo.metaTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="SEO title for search engines"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.seo.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaDescription: e.target.value },
                    })
                  }
                  placeholder="SEO description for search engines"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.seo.keywords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, keywords: e.target.value },
                    })
                  }
                  placeholder="Comma-separated keywords"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">SEO Preview</Label>
                </div>
                <div className="border rounded-lg p-4 bg-muted/20 space-y-2">
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-blue-600 mt-1 shrink-0" />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="text-blue-600 text-sm font-medium hover:underline cursor-pointer truncate">
                        {getSEOPreview().title}
                      </div>
                      <div className="text-green-700 text-xs truncate">{getSEOPreview().url}</div>
                      <div className="text-gray-600 text-sm leading-relaxed">{getSEOPreview().description}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                    This is how your category will appear in Google search results
                  </div>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="flex flex-col sm:flex-col gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {category ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {category ? "Update Category" : "Add Category"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
