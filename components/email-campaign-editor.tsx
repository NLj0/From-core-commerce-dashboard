"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { Save, Target, AlertTriangle, FileText } from "lucide-react"

interface EmailCampaign {
  id: number
  name: string
  subject: string
  content: string
  htmlContent?: string
  targetAudience: string
  scheduledDate?: string
  status: "draft" | "scheduled" | "sent"
  recipients: number
  openRate?: string
  clickRate?: string
}

interface EmailCampaignEditorProps {
  campaign?: EmailCampaign
  isOpen: boolean
  onClose: () => void
  onSave: (campaign: Partial<EmailCampaign>) => void
}

// Mock data for customer segments
const customerSegments = [
  { id: "all", name: "All Customers", count: 2847 },
  { id: "vip", name: "VIP Customers", count: 234 },
  { id: "regular", name: "Regular Customers", count: 1456 },
  { id: "new", name: "New Customers", count: 567 },
  { id: "inactive", name: "Inactive Customers", count: 590 },
  { id: "high-value", name: "High Value Customers", count: 189 },
]

// Mock data for email templates
const campaignTemplates = [
  {
    id: 1,
    name: "Holiday Flash Sale",
    type: "promotion",
    subject: "Holiday Flash Sale - 48 Hours Only!",
    text:
      "Hi {CustomerName},\n\nOur biggest holiday sale of the year starts now! Enjoy limited-time savings on our best sellers before they disappear.\n\nUse code HOLIDAY25 at checkout to unlock 25% off.\n\nHappy shopping,\n{CompanyName}",
    html: `
      <p style="font-size:16px;color:#334155;">Hi {CustomerName},</p>
      <h1 style="font-size:28px;color:#1d4ed8;margin:0 0 12px;">Holiday Flash Sale 🎁</h1>
      <p style="font-size:16px;color:#475569;">Our biggest holiday sale of the year starts now! Enjoy limited-time savings on our best sellers before they disappear.</p>
      <div style="background:#1d4ed8;color:#ffffff;padding:18px;border-radius:12px;text-align:center;margin:24px 0;">
        <p style="font-size:18px;margin:0 0 6px;">Use code <strong>HOLIDAY25</strong></p>
        <p style="font-size:14px;margin:0;">Unlock 25% off storewide for the next 48 hours</p>
      </div>
      <a href="https://yourstore.com" style="display:inline-block;background:#10b981;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:9999px;">Shop the Sale</a>
      <p style="font-size:14px;color:#94a3b8;margin-top:24px;">You are receiving this email because you opted in at checkout. Unsubscribe anytime via the link below.</p>
    `,
  },
  {
    id: 2,
    name: "Product Launch Spotlight",
    type: "product",
    subject: "Meet Our New Arrival — Built for You",
    text:
      "Hey {CustomerName},\n\nWe just released something special and you get the first look. Discover the features, see it in action, and grab exclusive launch pricing before it's gone.\n\nCheers,\nThe {CompanyName} Team",
    html: `
      <p style="font-size:16px;color:#334155;">Hey {CustomerName},</p>
      <h2 style="font-size:26px;color:#0f172a;margin-bottom:8px;">Introducing your new favorite product</h2>
      <p style="font-size:16px;color:#475569;">We built this launch with you in mind. Explore the highlights below and grab exclusive launch pricing while it lasts.</p>
      <ul style="padding-left:20px;color:#475569;font-size:15px;">
        <li>✨ Premium materials with a modern finish</li>
        <li>⚙️ Smarter performance built on customer feedback</li>
        <li>🚀 Launch pricing available for the first 500 orders</li>
      </ul>
      <div style="margin:24px 0;padding:16px;border-radius:12px;background:#f1f5f9;border:1px solid #e2e8f0;">
        <strong style="color:#0f172a;">Launch Bonus:</strong>
        <span style="color:#475569;"> Free expedited shipping when you order before {LaunchDeadline}.</span>
      </div>
      <a href="https://yourstore.com/new" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 26px;border-radius:8px;">Explore the Product</a>
    `,
  },
  {
    id: 3,
    name: "Monthly Newsletter",
    type: "newsletter",
    subject: "{CompanyName} Insider — What’s New This Month",
    text:
      "Hello {CustomerName},\n\nHere’s what happened this month: new arrivals, community highlights, and upcoming events you won’t want to miss.\n\nStay tuned for more exciting updates!\n\nWarmly,\nTeam {CompanyName}",
    html: `
      <p style="font-size:16px;color:#1f2937;">Hello {CustomerName},</p>
      <h2 style="font-size:24px;color:#0f172a;margin-bottom:12px;">Inside this month’s newsletter</h2>
      <div style="display:grid;gap:16px;">
        <div style="padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 8px;color:#1d4ed8;">✨ Fresh Arrivals</h3>
          <p style="margin:0;color:#475569;">Discover the latest additions our community is loving right now.</p>
        </div>
        <div style="padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 8px;color:#1d4ed8;">📣 Customer Spotlight</h3>
          <p style="margin:0;color:#475569;">See how {CustomerStoryName} is using our products to level up their workflow.</p>
        </div>
        <div style="padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
          <h3 style="margin:0 0 8px;color:#1d4ed8;">🗓 Upcoming Events</h3>
          <p style="margin:0;color:#475569;">Join us for live sessions, product walkthroughs, and community Q&As.</p>
        </div>
      </div>
      <p style="font-size:14px;color:#94a3b8;margin-top:24px;">You’re receiving this newsletter because you subscribed on our website. Manage preferences or unsubscribe anytime.</p>
    `,
  },
  {
    id: 4,
    name: "Customer Feedback",
    type: "retention",
    subject: "We’d love your feedback on your recent experience",
    text:
      "Hi {CustomerName},\n\nThanks for being part of the {CompanyName} family. We’re always improving and would love to hear how your recent experience went.\n\nCan you spare 60 seconds to answer a quick survey?\n\nThank you!\n{CompanyName} Support",
    html: `
      <p style="font-size:16px;color:#334155;">Hi {CustomerName},</p>
      <p style="font-size:16px;color:#475569;">Thanks for being part of the {CompanyName} family. Your thoughts help us craft better experiences for every customer.</p>
      <p style="font-size:16px;color:#475569;">Could you spare 60 seconds to share feedback on your recent purchase?</p>
      <a href="https://yourstore.com/survey" style="display:inline-block;margin:20px 0;background:#6366f1;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 28px;border-radius:9999px;">Share Feedback</a>
      <p style="font-size:14px;color:#94a3b8;">If this message wasn’t meant for you, please ignore it or unsubscribe using the link below.</p>
    `,
  },
]

const htmlToPlainText = (html: string) => {
  if (!html) return ""

  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|section|h[1-6]|li|br|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim()
}

export function EmailCampaignEditor({ campaign, isOpen, onClose, onSave }: EmailCampaignEditorProps) {
  const [formData, setFormData] = useState(() => {
    const initialHtmlContent = campaign?.htmlContent || ""
    const initialPlainText = campaign?.content || (initialHtmlContent ? htmlToPlainText(initialHtmlContent) : "")

    return {
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: initialPlainText,
      htmlContent: initialHtmlContent,
      targetAudience: campaign?.targetAudience || "all",
      scheduledDate: campaign?.scheduledDate || "",
      status: campaign?.status || ("draft" as const),
    }
  })

  const [activeTab, setActiveTab] = useState("content")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [sendOption, setSendOption] = useState("schedule")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const selectedSegment = customerSegments.find((seg) => seg.id === formData.targetAudience)
  const estimatedRecipients = selectedSegment?.count || 0

  useEffect(() => {
    if (!isOpen) return

    const nextHtmlContent = campaign?.htmlContent || ""
    const nextPlainText = campaign?.content || (nextHtmlContent ? htmlToPlainText(nextHtmlContent) : "")

    setFormData({
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: nextPlainText,
      htmlContent: nextHtmlContent,
      targetAudience: campaign?.targetAudience || "all",
      scheduledDate: campaign?.scheduledDate || "",
      status: campaign?.status || ("draft" as const),
    })
    setValidationErrors([])
  }, [campaign, isOpen])

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push("Campaign name is required")
    }
    if (!formData.subject.trim()) {
      errors.push("Email subject is required")
    }
    if (!formData.htmlContent.trim()) {
      errors.push("HTML content is required")
    }
    if (sendOption === "schedule" && !formData.scheduledDate) {
      errors.push("Schedule date is required when scheduling a campaign")
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    onSave({
      ...formData,
      recipients: estimatedRecipients,
      status: sendOption === "draft" ? "draft" : sendOption === "schedule" ? "scheduled" : "sent",
    })
    onClose()
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = campaignTemplates.find((t) => t.id === Number.parseInt(templateId))
    if (template) {
      setFormData((prev) => ({
        ...prev,
        subject: template.subject,
        content: template.text || htmlToPlainText(template.html),
        htmlContent: template.html,
      }))
    }
  }

  const handleHtmlContentChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      htmlContent: value,
      content: htmlToPlainText(value),
    }))
  }

  const resetForm = () => {
    const resetHtmlContent = campaign?.htmlContent || ""
    const resetPlainText = campaign?.content || (resetHtmlContent ? htmlToPlainText(resetHtmlContent) : "")

    setFormData({
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: resetPlainText,
      htmlContent: resetHtmlContent,
      targetAudience: campaign?.targetAudience || "all",
      scheduledDate: campaign?.scheduledDate || "",
      status: campaign?.status || ("draft" as const),
    })
    setSelectedTemplate("")
    setValidationErrors([])
  }

  const emailPreviewHtml =
    formData.htmlContent && formData.htmlContent.trim().length > 0
      ? formData.htmlContent
      : formData.content
          ? formData.content.replace(/\n/g, "<br>")
          : ""

  const emailPreviewSrcDoc = `
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
  `

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-lg md:text-xl">
            {campaign ? "Edit Email Campaign" : "Create New Email Campaign"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Design and schedule your marketing campaign to reach your target audience.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 md:gap-6 flex-1 min-h-0">
          {/* Left Sidebar - Campaign Settings & Audience */}
          <div className="space-y-4 overflow-y-auto lg:col-span-1 max-h-[300px] lg:max-h-none">
            {/* Campaign Details */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Campaign Details</Label>
              <div className="p-3 border rounded-md bg-background border-secondary space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name" className="text-xs">
                    Campaign Name
                  </Label>
                  <Input
                    id="campaign-name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter campaign name"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaign-template" className="text-xs">
                    Use Template (Optional)
                  </Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={(value) => {
                      setSelectedTemplate(value)
                      handleTemplateSelect(value)
                    }}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Target Audience</Label>
              <div className="p-3 border rounded-md bg-background border-secondary space-y-2">
                <Select
                  value={formData.targetAudience}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, targetAudience: value }))}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {customerSegments.map((segment) => (
                      <SelectItem key={segment.id} value={segment.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{segment.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">({segment.count.toLocaleString()})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Est. Recipients:</span>
                    <span className="font-semibold">{estimatedRecipients.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Reach:</span>
                    <span className="font-semibold">{((estimatedRecipients / 2847) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Settings */}
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Schedule Settings</Label>
              <div className="p-3 border rounded-md bg-background border-secondary space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="send-option" className="text-xs">
                    Send Option
                  </Label>
                  <Select value={sendOption} onValueChange={setSendOption}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Select send option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="schedule">Schedule for Later</SelectItem>
                      <SelectItem value="send">Send Immediately</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sendOption === "schedule" && (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date" className="text-xs">
                      Schedule Date & Time
                    </Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        sendOption === "draft"
                          ? "badge-gray"
                          : sendOption === "schedule"
                            ? "badge-blue"
                            : "badge-emerald"
                      }
                      className="text-xs"
                    >
                      {sendOption === "draft" ? "Draft" : sendOption === "schedule" ? "Scheduled" : "Sending"}
                    </Badge>
                  </div>
                  {sendOption === "schedule" && formData.scheduledDate && (
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span className="font-medium">{new Date(formData.scheduledDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button variant="outline" size="sm" onClick={resetForm} className="w-full text-xs bg-transparent">
                Reset Changes
              </Button>
            </div>
          </div>

          {/* Right Panel - Content Editor */}
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
              <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
                <TabsTrigger value="content" className="text-xs md:text-sm">
                  <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Content</span>
                  <span className="sm:hidden">Content</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs md:text-sm">
                  <Target className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Preview</span>
                  <span className="sm:hidden">Preview</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="flex-1 flex flex-col space-y-2 min-h-0">
                <div className="space-y-2 flex-shrink-0">
                  <Label htmlFor="campaign-subject" className="text-sm">
                    Email Subject
                  </Label>
                  <Input
                    id="campaign-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject line"
                    className="text-sm md:text-base"
                  />
                </div>

                <div className="flex-1 flex flex-col space-y-2 min-h-0">
                  <Label htmlFor="html-content" className="text-sm">
                    HTML Content
                  </Label>
                  <Textarea
                    id="html-content"
                    value={formData.htmlContent}
                    onChange={(e) => handleHtmlContentChange(e.target.value)}
                    placeholder="<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Welcome to {CompanyName}</h1>\n  </body>\n</html>"
                    className="flex-1 font-mono text-xs md:text-sm resize-none overflow-auto whitespace-pre min-h-[300px] md:min-h-[400px]"
                    spellCheck={false}
                  />
                </div>

                <div className="flex-shrink-0 p-3 border rounded-md bg-muted/20">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      <strong>Available Placeholders:</strong> {"{CustomerName}"}, {"{CustomerEmail}"}, {"{CompanyName}"},{" "}
                      {"{UnsubscribeLink}"}
                    </p>
                    <p className="leading-relaxed">
                      Write or paste full HTML emails here — we’ll generate a plain-text fallback automatically and keep your preview in sync.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 flex flex-col space-y-3 min-h-0">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Campaign Preview</Label>
                  <span className="text-xs text-muted-foreground">
                    Estimated audience: {estimatedRecipients.toLocaleString()} recipients
                  </span>
                </div>
                <Card className="flex-1 flex flex-col overflow-hidden min-h-[320px] md:min-h-[520px]">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                        Email Subject
                      </Label>
                      <div className="border border-secondary rounded-md bg-muted/40 px-3 py-2">
                        <CardTitle className="text-sm md:text-base m-0">
                          {formData.subject || "Email Subject"}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <iframe
                      title="Email Preview"
                      srcDoc={emailPreviewSrcDoc}
                      className="w-full h-full border-0"
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
            {sendOption === "draft" ? "Save Draft" : sendOption === "schedule" ? "Schedule Campaign" : "Send Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
