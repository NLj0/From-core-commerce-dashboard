"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, Code, Type, X } from "lucide-react"

interface EmailTemplate {
  id: number
  name: string
  type: "transactional" | "marketing"
  subject: string
  content: string
  htmlContent: string
  lastModified: string
  status: "active" | "draft"
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate
  isOpen: boolean
  onClose: () => void
  onSave: (template: Partial<EmailTemplate>) => void
}

const placeholders = [
  { key: "{CustomerName}", description: "Customer's full name" },
  { key: "{CustomerEmail}", description: "Customer's email address" },
  { key: "{OrderID}", description: "Order identification number" },
  { key: "{OrderTotal}", description: "Total order amount" },
  { key: "{ProductName}", description: "Product name" },
  { key: "{CompanyName}", description: "Your company name" },
  { key: "{SupportEmail}", description: "Support email address" },
  { key: "{UnsubscribeLink}", description: "Unsubscribe link" },
]

export function EmailTemplateEditor({ template, isOpen, onClose, onSave }: EmailTemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    type: template?.type || ("marketing" as const),
    subject: template?.subject || "",
    content: template?.content || "",
    htmlContent: template?.htmlContent || "",
    status: template?.status || ("draft" as const),
  })

  const [activeTab, setActiveTab] = useState("visual")

  const handleSave = () => {
    onSave({
      ...formData,
      lastModified: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  const insertPlaceholder = (placeholder: string) => {
    if (activeTab === "visual") {
      setFormData((prev) => ({
        ...prev,
        content: prev.content + placeholder,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        htmlContent: prev.htmlContent + placeholder,
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Email Template" : "Create New Email Template"}</DialogTitle>
          <DialogDescription>Design your email template with support for dynamic placeholders.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 h-[600px]">
          {/* Left Panel - Template Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-type">Template Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "transactional" | "marketing") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-subject">Subject Line</Label>
              <Input
                id="template-subject"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "draft") => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Placeholders */}
            <div className="space-y-2">
              <Label>Available Placeholders</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {placeholders.map((placeholder) => (
                  <div key={placeholder.key} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1">
                      <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">{placeholder.key}</code>
                      <p className="text-xs text-muted-foreground mt-1">{placeholder.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => insertPlaceholder(placeholder.key)}>
                      <X className="h-3 w-3 rotate-45" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Content Editor */}
          <div className="col-span-2 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visual">
                  <Type className="mr-2 h-4 w-4" />
                  Visual
                </TabsTrigger>
                <TabsTrigger value="html">
                  <Code className="mr-2 h-4 w-4" />
                  HTML
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visual" className="space-y-2">
                <Label htmlFor="visual-content">Email Content</Label>
                <Textarea
                  id="visual-content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your email content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="html" className="space-y-2">
                <Label htmlFor="html-content">HTML Content</Label>
                <Textarea
                  id="html-content"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, htmlContent: e.target.value }))}
                  placeholder="Enter HTML content here..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </TabsContent>

              <TabsContent value="preview" className="space-y-2">
                <Label>Email Preview</Label>
                <Card className="min-h-[400px]">
                  <CardHeader>
                    <CardTitle className="text-lg">{formData.subject || "Email Subject"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {formData.htmlContent ? (
                        <div dangerouslySetInnerHTML={{ __html: formData.htmlContent }} />
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {formData.content || "Email content will appear here..."}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
