"use client"

import { useState } from "react"
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
import { Save, Users, Calendar, Target, Settings } from "lucide-react"

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

  const [activeTab, setActiveTab] = useState("details")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [sendOption, setSendOption] = useState("schedule")

  const selectedSegment = customerSegments.find((seg) => seg.id === formData.targetAudience)
  const estimatedRecipients = selectedSegment?.count || 0

  const handleSave = () => {
    onSave({
      ...formData,
      recipients: estimatedRecipients,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{campaign ? "Edit Email Campaign" : "Create New Email Campaign"}</DialogTitle>
          <DialogDescription>
            Design and schedule your marketing campaign to reach your target audience.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[600px]">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">
              <Settings className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="audience">
              <Users className="mr-2 h-4 w-4" />
              Audience
            </TabsTrigger>
            <TabsTrigger value="content">
              <Target className="mr-2 h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto h-[500px] no-scrollbar">
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter campaign name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-subject">Email Subject</Label>
                    <Input
                      id="campaign-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="Enter email subject line"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="campaign-template">Use Template (Optional)</Label>
                    <Select
                      value={selectedTemplate}
                      onValueChange={(value) => {
                        setSelectedTemplate(value)
                        handleTemplateSelect(value)
                      }}
                    >
                      <SelectTrigger>
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

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Campaign Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={formData.status === "draft" ? "badge-gray" : "badge-blue"}>
                          {formData.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Target Audience:</span>
                        <span>{selectedSegment?.name || "Not selected"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Recipients:</span>
                        <span className="font-medium">{estimatedRecipients.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Scheduled:</span>
                        <span>
                          {formData.scheduledDate
                            ? new Date(formData.scheduledDate).toLocaleDateString()
                            : "Not scheduled"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Select Target Audience</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose which customer segment to target with this campaign.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                              className={`w-4 h-4 rounded-full border-2 ${
                                formData.targetAudience === segment.id
                                  ? "bg-primary border-primary"
                                  : "border-muted-foreground"
                              }`}
                            />
                            <div>
                              <h3 className="font-medium">{segment.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {segment.count.toLocaleString()} customers
                              </p>
                            </div>
                          </div>
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Selected Audience</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedSegment?.name} - {estimatedRecipients.toLocaleString()} recipients
                        </p>
                      </div>
                      <Badge variant="outline">{((estimatedRecipients / 2847) * 100).toFixed(1)}% of total</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-content">Email Content</Label>
                  <Textarea
                    id="email-content"
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your campaign email content here..."
                    className="min-h-[300px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Available Placeholders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {["{CustomerName}", "{CustomerEmail}", "{CompanyName}", "{UnsubscribeLink}"].map(
                        (placeholder) => (
                          <Button
                            key={placeholder}
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-xs bg-transparent"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                content: prev.content + placeholder,
                              }))
                            }
                          >
                            {placeholder}
                          </Button>
                        ),
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Content Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm bg-muted p-3 rounded-md min-h-[200px]">
                        <div className="font-medium mb-2">Subject: {formData.subject || "Email Subject"}</div>
                        <div className="whitespace-pre-wrap">
                          {formData.content || "Email content will appear here..."}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Send Options</Label>
                  <Select value={sendOption} onValueChange={setSendOption}>
                    <SelectTrigger>
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
                    <Label htmlFor="schedule-date">Schedule Date & Time</Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Campaign Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>Now</span>
                    </div>
                    {sendOption === "schedule" && formData.scheduledDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Scheduled:</span>
                        <span>{new Date(formData.scheduledDate).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          sendOption === "draft"
                            ? "badge-gray"
                            : sendOption === "schedule"
                              ? "badge-blue"
                              : "badge-emerald"
                        }
                      >
                        {sendOption === "draft" ? "Draft" : sendOption === "schedule" ? "Scheduled" : "Sending"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {sendOption === "draft" ? "Save Draft" : sendOption === "schedule" ? "Schedule Campaign" : "Send Campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
