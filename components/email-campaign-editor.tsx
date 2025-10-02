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
import { Save, Users, Target, AlertTriangle, FileText } from "lucide-react"

interface EmailCampaign {
  id: number
  name: string
  subject: string
  content: string
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
  { id: 1, name: "Promotional Sale", type: "marketing" },
  { id: 2, name: "Product Launch", type: "marketing" },
  { id: 3, name: "Newsletter", type: "marketing" },
  { id: 4, name: "Abandoned Cart", type: "marketing" },
  { id: 5, name: "Customer Survey", type: "marketing" },
]

export function EmailCampaignEditor({ campaign, isOpen, onClose, onSave }: EmailCampaignEditorProps) {
  const [formData, setFormData] = useState({
    name: campaign?.name || "",
    subject: campaign?.subject || "",
    content: campaign?.content || "",
    targetAudience: campaign?.targetAudience || "all",
    scheduledDate: campaign?.scheduledDate || "",
    status: campaign?.status || ("draft" as const),
  })

  const [activeTab, setActiveTab] = useState("content")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [sendOption, setSendOption] = useState("schedule")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const selectedSegment = customerSegments.find((seg) => seg.id === formData.targetAudience)
  const estimatedRecipients = selectedSegment?.count || 0

  useEffect(() => {
    if (!isOpen) return

    setFormData({
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: campaign?.content || "",
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
    if (!formData.content.trim()) {
      errors.push("Email content is required")
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
        subject: `${template.name} - Special Offer`,
        content: `This is a sample ${template.name.toLowerCase()} email content...`,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: campaign?.name || "",
      subject: campaign?.subject || "",
      content: campaign?.content || "",
      targetAudience: campaign?.targetAudience || "all",
      scheduledDate: campaign?.scheduledDate || "",
      status: campaign?.status || ("draft" as const),
    })
    setSelectedTemplate("")
    setValidationErrors([])
  }

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
                    <SelectTrigger className="text-sm">
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
                  <SelectTrigger className="text-sm">
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
                    <SelectTrigger className="text-sm">
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
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="content" className="text-xs md:text-sm">
                  <FileText className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Content</span>
                  <span className="sm:hidden">Content</span>
                </TabsTrigger>
                <TabsTrigger value="audience" className="text-xs md:text-sm">
                  <Users className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Audience</span>
                  <span className="sm:hidden">Audience</span>
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
                  <Label htmlFor="email-content" className="text-sm">
                    Email Content
                  </Label>
                  <Textarea
                    id="email-content"
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your campaign email content here..."
                    className="flex-1 font-mono text-xs md:text-sm resize-none overflow-auto whitespace-pre-wrap min-h-[300px] md:min-h-[400px]"
                  />
                </div>

                <div className="flex-shrink-0 p-3 border rounded-md bg-muted/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>Available Placeholders:</strong> {"{CustomerName}"}, {"{CustomerEmail}"}, {"{CompanyName}"},{" "}
                    {"{UnsubscribeLink}"}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="flex-1 flex flex-col space-y-4 min-h-0 overflow-y-auto">
                <div>
                  <Label className="text-base font-medium">Customer Segments</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose which customer segment to target with this campaign.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customerSegments.map((segment) => (
                    <Card
                      key={segment.id}
                      className={`cursor-pointer transition-colors ${
                        formData.targetAudience === segment.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, targetAudience: segment.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                formData.targetAudience === segment.id
                                  ? "bg-primary border-primary"
                                  : "border-muted-foreground"
                              }`}
                            />
                            <div className="min-w-0">
                              <h3 className="font-medium text-sm">{segment.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {segment.count.toLocaleString()} customers
                              </p>
                            </div>
                          </div>
                          <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-sm">Selected Audience</h3>
                        <p className="text-xs text-muted-foreground">
                          {selectedSegment?.name} - {estimatedRecipients.toLocaleString()} recipients
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {((estimatedRecipients / 2847) * 100).toFixed(1)}% of total
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 flex flex-col space-y-2 min-h-0">
                <Label className="text-sm">Campaign Preview</Label>
                <Card className="flex-1 flex flex-col overflow-hidden min-h-[300px] md:min-h-[500px]">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                          Campaign Name
                        </Label>
                        <div className="border border-secondary rounded-md bg-muted/40 px-3 py-2">
                          <CardTitle className="text-sm md:text-base m-0">{formData.name || "Campaign Name"}</CardTitle>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
                          Email Subject
                        </Label>
                        <div className="border border-secondary rounded-md bg-muted/40 px-3 py-2">
                          <CardTitle className="text-sm m-0">{formData.subject || "Email Subject"}</CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto p-6 bg-muted/20">
                      <div className="max-w-[600px] mx-auto bg-white p-6 rounded-md shadow-sm">
                        <div className="whitespace-pre-wrap text-sm">
                          {formData.content || "Email content will appear here..."}
                        </div>
                      </div>
                    </div>
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
