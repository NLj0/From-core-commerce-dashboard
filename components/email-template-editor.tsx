"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Save, Eye, Code, AlertTriangle, Type } from "lucide-react"

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

  const [activeTab, setActiveTab] = useState("html")
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [defaultTemplateFeedback, setDefaultTemplateFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const requiredPlaceholders = template?.requiredPlaceholders || []
  const availablePlaceholders = getPlaceholdersForTemplate(formData.name)

  useEffect(() => {
    if (!isOpen) return

    setFormData({
      name: template?.name || "",
      type: template?.type || ("marketing" as const),
      subject: template?.subject || "",
      content: template?.content || "",
      htmlContent: template?.htmlContent || "",
    })
    setDefaultTemplateFeedback(null)
    setValidationErrors([])
  }, [template, isOpen])

  // Memoize inserted placeholders to prevent infinite re-renders
  const insertedPlaceholders = useMemo(() => {
    const combinedContent = `${formData.htmlContent}\n${formData.content}`
    const inserted = new Set<string>()

    requiredPlaceholders.forEach((placeholder) => {
      if (combinedContent.includes(placeholder)) {
        inserted.add(placeholder)
      }
    })

    return inserted
  }, [formData.content, formData.htmlContent, requiredPlaceholders])

  const validatePlaceholders = () => {
    const errors: string[] = []

    if (requiredPlaceholders.length > 0) {
      const combinedContent = `${formData.htmlContent}\n${formData.content}`
      const missingPlaceholders = requiredPlaceholders.filter((placeholder) => !combinedContent.includes(placeholder))

      if (missingPlaceholders.length > 0) {
        errors.push(`Missing required placeholders: ${missingPlaceholders.join(", ")}`)
      }
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  useEffect(() => {
    if (requiredPlaceholders.length > 0) {
      validatePlaceholders()
    } else if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }, [formData.htmlContent, formData.content, requiredPlaceholders, validationErrors.length])

  const insertPlaceholder = (placeholder: string) => {
    const textarea = document.getElementById("html-content") as HTMLTextAreaElement | null

    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = formData.htmlContent
      const newText = text.substring(0, start) + placeholder + text.substring(end)

      setFormData((prev) => ({ ...prev, htmlContent: newText }))

      // Focus back to textarea and set cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
      }, 0)
    } else {
      setFormData((prev) => ({
        ...prev,
        htmlContent: prev.htmlContent + placeholder,
      }))
    }
  }

  const getDefaultTemplate = (templateName: string) => {
    const templates: Record<string, { subject: string; content: string; htmlContent: string }> = {
      "Welcome & Account Activation": {
        subject: "Welcome aboard, {username}!",
        content: `Hi {username},

Welcome to our platform! We're excited to have you join our community.

To get started, please activate your account using the secure link below:
{activation_link}

If you have any questions, feel free to reach out to our support team anytime.

Warm regards,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Welcome aboard, {username}!</h2>
  <p>Hi {username},</p>
  <p>We're thrilled to have you join our community. Activate your account to start exploring.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{activation_link}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Activate your account</a>
  </div>
  <p>If you have any questions, simply reply to this email and we'll be happy to help.</p>
  <p>Warm regards,<br>The Team</p>
</div>`,
      },
      "Order Confirmation": {
        subject: "Your order {order_id} is confirmed",
        content: `Hi {username},

Thank you for shopping with us! Your order {order_id} is confirmed and will be on its way soon.

Order Summary:
{order_summary}

Total Amount: {total_amount}

You can follow the delivery here: {delivery_link}

Thanks again for choosing us!
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Order Confirmation</h2>
  <p>Hi {username},</p>
  <p>Thanks for shopping with us! Your order <strong>{order_id}</strong> is confirmed.</p>
  <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0 0 12px;"><strong>Order Summary:</strong></p>
    <div>{order_summary}</div>
    <p style="margin-top: 12px;"><strong>Total Amount:</strong> {total_amount}</p>
  </div>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{delivery_link}" style="background-color: #16a34a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track delivery status</a>
  </div>
  <p>If you need any assistance, just reply to this email.</p>
  <p>Warm regards,<br>The Team</p>
</div>`,
      },
      "Order Status Updates": {
        subject: "Order {order_id} update: {order_status}",
        content: `Hi {username},

There's an update on your order {order_id}.

Current status: {order_status}

Track progress here: {tracking_link}

We'll keep you posted with any new changes.
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Order Update</h2>
  <p>Hi {username},</p>
  <p>Your order <strong>{order_id}</strong> status has changed to <strong>{order_status}</strong>.</p>
  <p>You can follow the live progress using the link below:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{tracking_link}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Track your order</a>
  </div>
  <p>We're standing by if you need any help.</p>
  <p>Best regards,<br>The Team</p>
</div>`,
      },
      "Password Reset": {
        subject: "Password reset instructions for {username}",
        content: `Hi {username},

We received a request to reset your password. You can create a new one using the secure link below:
{reset_link}

If you didn't request this change, please ignore this message.

Stay secure,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Password reset requested</h2>
  <p>Hi {username},</p>
  <p>We received a request to reset your password. Click the button below to set a new one.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{reset_link}" style="background-color: #1d4ed8; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset your password</a>
  </div>
  <p>If you didn't request this change, no action is needed and your account is still secure.</p>
  <p>Stay secure,<br>The Team</p>
</div>`,
      },
      "Security & Account Notifications": {
        subject: "{notification_type} detected on your account",
        content: `Hi {username},

We detected a {notification_type} on your account at {notification_time}.

If this was you, no action is needed. Otherwise, please review your account security settings immediately.

Stay safe,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #b91c1c;">Important security alert</h2>
  <p>Hi {username},</p>
  <p>We noticed a <strong>{notification_type}</strong> on your account at <strong>{notification_time}</strong>.</p>
  <p>If this activity was not initiated by you, please secure your account right away.</p>
  <p>Need help? Just reply to this email and our security team will jump in.</p>
  <p>Stay safe,<br>The Team</p>
</div>`,
      },
      "Invoices & Receipts": {
        subject: "Invoice {order_id} dated {invoice_date}",
        content: `Hi {username},

Here's your invoice for order {order_id} placed on {invoice_date}.

Total Amount: {total_amount}

Download your invoice here: {invoice_link}

Thank you for your business,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Your invoice is ready</h2>
  <p>Hi {username},</p>
  <p>Here are the details for your order <strong>{order_id}</strong> placed on <strong>{invoice_date}</strong>.</p>
  <p><strong>Total Amount:</strong> {total_amount}</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{invoice_link}" style="background-color: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Download invoice</a>
  </div>
  <p>If you need a different format or have questions, just let us know.</p>
  <p>Thank you for your business,<br>The Team</p>
</div>`,
      },
      "Review Request": {
        subject: "How was {product_name}, {username}?",
        content: `Hi {username},

We hope you're enjoying {product_name}!

Your feedback helps other customers. Share your thoughts here: {review_link}

Thanks for being part of our community,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">We'd love your feedback</h2>
  <p>Hi {username},</p>
  <p>We hope you're loving <strong>{product_name}</strong>.</p>
  <p>Your review helps other shoppers make confident decisions.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{review_link}" style="background-color: #f97316; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Leave a quick review</a>
  </div>
  <p>Thanks for being part of our community!</p>
  <p>Warm regards,<br>The Team</p>
</div>`,
      },
      "Promotional & Marketing Emails": {
        subject: "Exclusive offer just for you, {username}!",
        content: `Hi {username},

We picked something special for you.

Use promo code {promo_code} before {offer_expiry} and unlock exclusive savings.

Explore the offer now: {promo_link}

Enjoy!
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #f97316, #ef4444); color: #ffffff; padding: 32px; border-radius: 16px;">
  <h2 style="margin-top: 0;">An offer you can't miss, {username}!</h2>
  <p>Use promo code <strong>{promo_code}</strong> before <strong>{offer_expiry}</strong> to unlock exclusive savings.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{promo_link}" style="background-color: #ffffff; color: #ef4444; padding: 12px 24px; text-decoration: none; border-radius: 9999px; display: inline-block; font-weight: bold;">Claim your offer</a>
  </div>
  <p>See you there!</p>
</div>`,
      },
      "Abandoned Cart Emails": {
        subject: "Still thinking it over, {username}?",
        content: `Hi {username},

We saved your cart with these items:
{cart_items}

Come back to complete your purchase: {cart_link}

Use {discount_offer} before it expires!

See you soon,
The Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">We saved your cart for you</h2>
  <p>Hi {username},</p>
  <p>You left a few things behind:</p>
  <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    {cart_items}
  </div>
  <p>Use your special offer <strong>{discount_offer}</strong> before it expires.</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="{cart_link}" style="background-color: #1f2937; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Return to your cart</a>
  </div>
  <p>Need help? Reply to this email and we'll lend a hand.</p>
  <p>See you soon,<br>The Team</p>
</div>`,
      },
      "Customer Support Emails": {
        subject: "Update on ticket {ticket_id}",
        content: `Hi {username},

We're reaching out with an update on support ticket {ticket_id}.

Status: {ticket_status}

Our latest note:
{support_message}

We'll keep you posted with any new information.
The Support Team`,
        htmlContent: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Support ticket update</h2>
  <p>Hi {username},</p>
  <p>We're checking in about your support ticket <strong>{ticket_id}</strong>.</p>
  <p><strong>Status:</strong> {ticket_status}</p>
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0 0 8px; font-weight: 600;">Latest update:</p>
    <p style="margin: 0;">{support_message}</p>
  </div>
  <p>If you have any follow-up questions, simply reply to this message.</p>
  <p>Best regards,<br>The Support Team</p>
</div>`,
      },
    }

    return templates[templateName] || null
  }

  const applyDefaultTemplate = () => {
    const defaultTemplate = getDefaultTemplate(formData.name)

    if (!defaultTemplate) {
      setDefaultTemplateFeedback({
        type: "error",
        message: "No default template is available for this email type yet.",
      })
      return false
    }

    const missingPlaceholders = requiredPlaceholders.filter(
      (placeholder) =>
        !defaultTemplate.htmlContent.includes(placeholder) &&
        !defaultTemplate.content.includes(placeholder) &&
        !defaultTemplate.subject.includes(placeholder),
    )

    if (missingPlaceholders.length > 0) {
      setDefaultTemplateFeedback({
        type: "error",
        message: `Default template is missing required placeholders: ${missingPlaceholders.join(", ")}`,
      })
      return false
    }

    setFormData((prev) => ({
      ...prev,
      subject: defaultTemplate.subject,
      content: defaultTemplate.content,
      htmlContent: defaultTemplate.htmlContent,
    }))
    setDefaultTemplateFeedback({
      type: "success",
      message: "Default template applied for this email.",
    })
    return true
  }

  const resetToOriginal = () => {
    setFormData((prev) => ({
      ...prev,
      name: template?.name ?? prev.name,
      type: template?.type ?? prev.type,
      subject: template?.subject || "",
      content: template?.content || "",
      htmlContent: template?.htmlContent || "",
    }))
    setDefaultTemplateFeedback(null)
    setValidationErrors([])
  }

  const handleSave = () => {
    if (!validatePlaceholders()) {
      return
    }

    onSave({
      ...formData,
      lastModified: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg md:text-xl">Edit Email Template: {template?.name}</DialogTitle>
          <DialogDescription className="text-sm">
            Edit your email template content. Required placeholders must be included in the template.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto lg:col-span-1 max-h-[300px] lg:max-h-none">
            {requiredPlaceholders.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <Label className="text-red-600 font-semibold text-sm">Required Placeholders</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyDefaultTemplate}
                    className="text-xs w-full sm:w-auto bg-transparent"
                  >
                    Reset to Default
                  </Button>
                </div>
                <div className="space-y-2 p-3 border rounded-md bg-background border-secondary">
                  {requiredPlaceholders.map((placeholder) => {
                    const placeholderInfo = availablePlaceholders.find((p) => p.key === placeholder)
                    const isInserted = insertedPlaceholders.has(placeholder)
                    return (
                      <div key={placeholder} className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <code
                            className={`text-xs font-mono px-2 py-1 rounded block truncate ${
                              isInserted
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
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
                          className={`h-8 w-8 p-0 flex-shrink-0 ${isInserted ? "text-green-600 hover:text-green-700" : "text-red-600 hover:text-red-700"}`}
                          title={
                            isInserted ? "Already inserted - click to insert again" : "Click to insert placeholder"
                          }
                        >
                          +
                        </Button>
                      </div>
                    )
                  })}
                  <p className="text-xs text-muted-foreground mt-2">
                    Click on placeholders to insert them at cursor position. Green placeholders are already inserted.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-semibold text-sm">Template Code</Label>
              <div className="p-3 border rounded-md bg-muted/20">
                <p className="text-xs text-muted-foreground mb-2">
                  Use this section to edit the template code directly or reset to default template.
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyDefaultTemplate}
                    className="w-full text-xs bg-transparent"
                  >
                    Load Default Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToOriginal}
                    className="w-full text-xs bg-transparent"
                  >
                    Reset Changes
                  </Button>
                </div>
                {defaultTemplateFeedback && (
                  <p
                    className={`text-xs mt-2 ${
                      defaultTemplateFeedback.type === "error" ? "text-red-600" : "text-muted-foreground"
                    }`}
                  >
                    {defaultTemplateFeedback.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col min-h-0">
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4 flex-shrink-0">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="subject" className="text-xs md:text-sm">
                  <Type className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Subject</span>
                  <span className="sm:hidden">Subject</span>
                </TabsTrigger>
                <TabsTrigger value="html" className="text-xs md:text-sm">
                  <Code className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">HTML</span>
                  <span className="sm:hidden">HTML</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs md:text-sm">
                  <Eye className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Preview</span>
                  <span className="sm:hidden">Preview</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="subject" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label htmlFor="template-subject" className="text-sm">
                  Subject Line
                </Label>
                <Input
                  id="template-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                  className="text-sm md:text-base flex-shrink-0"
                />
                <div className="flex-1 p-4 border rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    The subject line is the first thing recipients see. Make it compelling and include relevant
                    placeholders.
                  </p>
                  {requiredPlaceholders.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Available placeholders for subject:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {requiredPlaceholders.map((placeholder) => (
                          <Button
                            key={placeholder}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById("template-subject") as HTMLInputElement
                              if (input) {
                                const start = input.selectionStart || 0
                                const end = input.selectionEnd || 0
                                const newValue =
                                  formData.subject.substring(0, start) + placeholder + formData.subject.substring(end)
                                setFormData((prev) => ({ ...prev, subject: newValue }))
                                setTimeout(() => {
                                  input.focus()
                                  input.setSelectionRange(start + placeholder.length, start + placeholder.length)
                                }, 0)
                              }
                            }}
                            className="text-xs h-6"
                          >
                            {placeholder}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="html" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label htmlFor="html-content" className="text-sm">
                  HTML Content
                </Label>
                <Textarea
                  id="html-content"
                  value={formData.htmlContent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, htmlContent: e.target.value }))}
                  placeholder="Enter HTML content here..."
                  className="flex-1 font-mono text-xs md:text-sm resize-none overflow-auto whitespace-pre min-h-[300px] md:min-h-[400px]"
                />
              </TabsContent>

              <TabsContent value="preview" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label className="text-sm">Email Preview</Label>
                <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] md:min-h-[500px]">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                        Email Subject
                      </Label>
                      <div className="border border-secondary rounded-md bg-muted/40 px-3 py-2">
                        <CardTitle className="text-sm md:text-lg m-0">{formData.subject || "Email Subject"}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <style>
                              body {
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                margin: 0;
                                padding: 20px;
                                background: white;
                              }
                              .email-content {
                                max-width: 600px;
                                margin: 0 auto;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="email-content">
                              ${formData.htmlContent || formData.content.replace(/\n/g, "<br>") || "Email content will appear here..."}
                            </div>
                          </body>
                        </html>
                      `}
                      className="w-full h-full border-0"
                      title="Email Preview"
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 mt-4 md:mt-6 flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={validationErrors.length > 0} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
