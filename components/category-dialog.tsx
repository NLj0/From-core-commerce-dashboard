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
import { Upload, Save, Search, Globe } from "lucide-react"

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
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
        image: "",
        status: "active",
        seo: {
          metaTitle: "",
          metaDescription: "",
          keywords: "",
        },
      })
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
          <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category information below." : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    required
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
                />
              </div>

              <div className="space-y-3">
                <Label>Category Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/20">
                    {formData.image ? (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Category"
                        className="h-16 w-16 object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <div className="text-xs text-muted-foreground">PNG, JPG up to 2MB. Recommended: 400x400px</div>
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

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" />
                {category ? "Update Category" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
