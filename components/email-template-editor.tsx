"use client"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Eye, Code, Type, X, AlertTriangle } from "lucide-react"

interface EmailTemplate {
  id: number
  name: string
  type: "transactional" | "marketing"
  subject: string
  content: string
  htmlContent: string
  lastModified: string
  status: "active" | "draft"
  requiredPlaceholders?: string[]
}

interface EmailTemplateEditorProps {
  template?: EmailTemplate
  isOpen: boolean
  onClose: () => void
  onSave: (template: Partial<EmailTemplate>) => void
}

const getPlaceholdersForTemplate = (templateName: string) => {
  const placeholderMap: Record<string, Array<{ key: string; description: string }>> = {
    "Welcome & Account Activation": [
      { key: "{username}", description: "Customer's username" },
      { key: "{activation_link}", description: "Account activation link" },
    ],
    "Order Confirmation": [
      { key: "{username}", description: "Customer's username" },
      { key: "{order_id}", description: "Order identification number" },
      { key: "{order_summary}", description: "Summary of ordered items" },
      { key: "{total_amount}", description: "Total order amount" },
      { key: "{delivery_link}", description: "Order delivery tracking link" },
    ],
    "Order Status Updates": [
      { key: "{username}", description: "Customer's username" },
      { key: "{order_id}", description: "Order identification number" },
      { key: "{order_status}", description: "Current order status" },
      { key: "{tracking_link}", description: "Package tracking link" },
    ],
    "Password Reset": [
      { key: "{username}", description: "Customer's username" },
      { key: "{reset_link}", description: "Password reset link" },
    ],
    "Security & Account Notifications": [
      { key: "{username}", description: "Customer's username" },
      { key: "{notification_type}", description: "Type of security notification" },
      { key: "{notification_time}", description: "Time of the notification" },
    ],
    "Invoices & Receipts": [
      { key: "{username}", description: "Customer's username" },
      { key: "{order_id}", description: "Order identification number" },
      { key: "{invoice_link}", description: "Link to download invoice" },
      { key: "{invoice_date}", description: "Invoice generation date" },
      { key: "{total_amount}", description: "Total invoice amount" },
    ],
    "Review Request": [
      { key: "{username}", description: "Customer's username" },
      { key: "{product_name}", description: "Name of the product to review" },
      { key: "{review_link}", description: "Link to leave a review" },
    ],
    "Promotional & Marketing Emails": [
      { key: "{username}", description: "Customer's username" },
      { key: "{promo_code}", description: "Promotional discount code" },
      { key: "{promo_link}", description: "Link to promotional offer" },
      { key: "{offer_expiry}", description: "Expiration date of the offer" },
    ],
    "Abandoned Cart Emails": [
      { key: "{username}", description: "Customer's username" },
      { key: "{cart_items}", description: "List of items in abandoned cart" },
      { key: "{cart_link}", description: "Link to return to cart" },
      { key: "{discount_offer}", description: "Special discount offer" },
    ],
    "Customer Support Emails": [
      { key: "{username}", description: "Customer's username" },
      { key: "{ticket_id}", description: "Support ticket ID" },
      { key: "{support_message}", description: "Support team message" },
      { key: "{ticket_status}", description: "Current ticket status" },
    ],
  }

  return placeholderMap[templateName] || []
}

export function EmailTemplateEditor({ template, isOpen, onClose, onSave }: EmailTemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    type: template?.type || ("marketing" as const),
    subject: template?.subject || "",
    content: template?.content || "",
    htmlContent: template?.htmlContent || "",
  })

  const [activeTab, setActiveTab] = useState("subject")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const requiredPlaceholders = template?.requiredPlaceholders || []
  const availablePlaceholders = getPlaceholdersForTemplate(formData.name)

  const validateContent = (content: string) => {
    const errors: string[] = []
    const missingPlaceholders: string[] = []

    requiredPlaceholders.forEach((placeholder) => {
      if (!content.includes(placeholder)) {
        missingPlaceholders.push(placeholder)
      }
    })

    if (missingPlaceholders.length > 0) {
      errors.push(`Missing required placeholders: ${missingPlaceholders.join(", ")}`)
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  useEffect(() => {
    if (formData.content && requiredPlaceholders.length > 0) {
      validateContent(formData.content)
    }
  }, [formData.content, requiredPlaceholders])

  const handleSave = () => {
    if (!validateContent(formData.content)) {
      return
    }

    onSave({
      ...formData,
      lastModified: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  const insertPlaceholder = (placeholder: string) => {
    if (activeTab === "subject") {
      setFormData((prev) => ({
        ...prev,
        subject: prev.subject + placeholder,
      }))
    } else if (activeTab === "html") {
      setFormData((prev) => ({
        ...prev,
        htmlContent: prev.htmlContent + placeholder,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        content: prev.content + placeholder,
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Email Template: {template?.name}</DialogTitle>
          <DialogDescription>
            Edit your email template content. Required placeholders must be included in the template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Panel - Template Settings */}
          <div className="space-y-4 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input id="template-name" value={formData.name} disabled className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-type">Template Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "transactional" | "marketing") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                disabled
              >
                <SelectTrigger className="bg-muted">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {requiredPlaceholders.length > 0 && (
              <div className="space-y-2">
                <Label className="text-red-600 font-semibold">Required Placeholders</Label>
                <div className="space-y-2 p-3 border rounded-md bg-background border-secondary">
                  {requiredPlaceholders.map((placeholder) => {
                    const placeholderInfo = availablePlaceholders.find((p) => p.key === placeholder)
                    return (
                      <div key={placeholder} className="flex items-center justify-between">
                        <div className="flex-1">
                          <code className="text-xs font-mono px-2 py-1 rounded bg-secondary text-foreground">
                            {placeholder}
                          </code>
                          {placeholderInfo && (
                            <p className="text-xs text-muted-foreground mt-1">{placeholderInfo.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertPlaceholder(placeholder)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3 rotate-45" />
                        </Button>
                      </div>
                    )
                  })}
                  <p className="text-xs text-red-600 mt-2">
                    These placeholders must be included in your template content.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Content Editor */}
          <div className="col-span-2 flex flex-col min-h-0">
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4 flex-shrink-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="subject">
                  <Type className="mr-2 h-4 w-4" />
                  Subject
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

              <TabsContent value="subject" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label htmlFor="template-subject">Subject Line</Label>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                  className="text-base flex-shrink-0"
                />
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your email content here..."
                  className="flex-1 font-mono text-sm resize-none"
                />
              </TabsContent>

              <TabsContent value="html" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label htmlFor="html-content">HTML Content</Label>
                <Textarea
                  id="html-content"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, htmlContent: e.target.value }))}
                  placeholder="Enter HTML content here..."
                  className="flex-1 font-mono text-sm resize-none overflow-auto"
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label>Email Preview</Label>
                <Card className="flex-1 overflow-auto">
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

        <DialogFooter className="flex-shrink-0 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={validationErrors.length > 0}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
