"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Mail,
  Send,
  Calendar,
  Users,
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Paperclip,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react"
import { EmailTemplateEditor } from "@/components/email-template-editor"
import { EmailCampaignEditor } from "@/components/email-campaign-editor"

// Mock data for email templates
const emailTemplates = [
  {
    id: 1,
    name: "Welcome & Account Activation",
    type: "transactional",
    subject: "Welcome to our store, {username}!",
    lastModified: "2024-01-15",
    status: "active",
    requiredPlaceholders: ["{username}", "{activation_link}"],
    content: "Welcome {username}! Please activate your account by clicking {activation_link}.",
  },
  {
    id: 2,
    name: "Order Confirmation",
    type: "transactional",
    subject: "Your order {order_id} has been confirmed",
    lastModified: "2024-01-14",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{order_summary}", "{total_amount}", "{delivery_link}"],
    content:
      "Hi {username}, your order {order_id} has been confirmed. Order summary: {order_summary}. Total: {total_amount}. Track delivery: {delivery_link}.",
  },
  {
    id: 3,
    name: "Order Status Updates",
    type: "transactional",
    subject: "Order {order_id} status update",
    lastModified: "2024-01-13",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{order_status}", "{tracking_link}"],
    content: "Hi {username}, your order {order_id} status is now: {order_status}. Track your order: {tracking_link}.",
  },
  {
    id: 4,
    name: "Password Reset",
    type: "transactional",
    subject: "Reset your password",
    lastModified: "2024-01-12",
    status: "active",
    requiredPlaceholders: ["{username}", "{reset_link}"],
    content: "Hi {username}, click here to reset your password: {reset_link}.",
  },
  {
    id: 5,
    name: "Security & Account Notifications",
    type: "transactional",
    subject: "Security notification for your account",
    lastModified: "2024-01-11",
    status: "active",
    requiredPlaceholders: ["{username}", "{notification_type}", "{notification_time}"],
    content: "Hi {username}, security notification: {notification_type} at {notification_time}.",
  },
  {
    id: 6,
    name: "Invoices & Receipts",
    type: "transactional",
    subject: "Invoice for order {order_id}",
    lastModified: "2024-01-10",
    status: "active",
    requiredPlaceholders: ["{username}", "{order_id}", "{invoice_link}", "{invoice_date}", "{total_amount}"],
    content:
      "Hi {username}, your invoice for order {order_id} is ready. Date: {invoice_date}. Amount: {total_amount}. Download: {invoice_link}.",
  },
  {
    id: 7,
    name: "Review Request",
    type: "marketing",
    subject: "How was your {product_name}?",
    lastModified: "2024-01-09",
    status: "active",
    requiredPlaceholders: ["{username}", "{product_name}", "{review_link}"],
    content: "Hi {username}, please review your recent purchase of {product_name}: {review_link}.",
  },
  {
    id: 8,
    name: "Promotional & Marketing Emails",
    type: "marketing",
    subject: "Special offer just for you, {username}!",
    lastModified: "2024-01-08",
    status: "active",
    requiredPlaceholders: ["{username}", "{promo_code}", "{promo_link}", "{offer_expiry}"],
    content:
      "Hi {username}, use code {promo_code} for a special discount! Shop now: {promo_link}. Expires: {offer_expiry}.",
  },
  {
    id: 9,
    name: "Abandoned Cart Emails",
    type: "marketing",
    subject: "Don't forget your items, {username}",
    lastModified: "2024-01-07",
    status: "active",
    requiredPlaceholders: ["{username}", "{cart_items}", "{cart_link}", "{discount_offer}"],
    content:
      "Hi {username}, you left these items in your cart: {cart_items}. Complete your purchase: {cart_link}. Special offer: {discount_offer}.",
  },
  {
    id: 10,
    name: "Customer Support Emails",
    type: "transactional",
    subject: "Support ticket {ticket_id} update",
    lastModified: "2024-01-06",
    status: "active",
    requiredPlaceholders: ["{username}", "{ticket_id}", "{support_message}", "{ticket_status}"],
    content: "Hi {username}, update on ticket {ticket_id}: {support_message}. Status: {ticket_status}.",
  },
]

// Mock data for email campaigns
const emailCampaigns = [
  {
    id: 1,
    name: "Winter Sale 2024",
    recipients: 1250,
    status: "sent",
    date: "2024-01-15",
    openRate: "24.5%",
    clickRate: "3.2%",
  },
  {
    id: 2,
    name: "New Product Launch",
    recipients: 890,
    status: "scheduled",
    date: "2024-01-20",
    openRate: "-",
    clickRate: "-",
  },
  {
    id: 3,
    name: "Customer Feedback Survey",
    recipients: 2100,
    status: "draft",
    date: "-",
    openRate: "-",
    clickRate: "-",
  },
]

// Mock data for email logs
const emailLogs = [
  {
    id: 1,
    recipient: "john@example.com",
    recipientName: "John Doe",
    subject: "Your order #ORD-001 has been confirmed",
    type: "transactional",
    status: "sent",
    date: "2024-01-15 10:30",
    template: "Order Confirmation",
    openedAt: "2024-01-15 11:45",
    clickedAt: null,
    bounced: false,
    unsubscribed: false,
  },
  {
    id: 2,
    recipient: "sarah@example.com",
    recipientName: "Sarah Wilson",
    subject: "Winter Sale - 50% Off Everything!",
    type: "marketing",
    status: "sent",
    date: "2024-01-15 09:15",
    template: "Winter Sale 2024",
    openedAt: "2024-01-15 10:22",
    clickedAt: "2024-01-15 10:25",
    bounced: false,
    unsubscribed: false,
  },
  {
    id: 3,
    recipient: "mike@example.com",
    recipientName: "Mike Johnson",
    subject: "Your order #ORD-003 has been delivered",
    type: "transactional",
    status: "failed",
    date: "2024-01-14 16:45",
    template: "Product Delivery",
    openedAt: null,
    clickedAt: null,
    bounced: true,
    unsubscribed: false,
    failureReason: "Invalid email address",
  },
  {
    id: 4,
    recipient: "emma@example.com",
    recipientName: "Emma Davis",
    subject: "Don't forget your items, Emma",
    type: "marketing",
    status: "sent",
    date: "2024-01-14 14:20",
    template: "Abandoned Cart",
    openedAt: null,
    clickedAt: null,
    bounced: false,
    unsubscribed: true,
  },
  {
    id: 5,
    recipient: "alex@example.com",
    recipientName: "Alex Brown",
    subject: "Welcome to our store, Alex!",
    type: "marketing",
    status: "sent",
    date: "2024-01-13 12:00",
    template: "Welcome Email",
    openedAt: "2024-01-13 13:15",
    clickedAt: "2024-01-13 13:18",
    bounced: false,
    unsubscribed: false,
  },
]

// Mock data for customers (for recipient selection)
const customers = [
  { id: 1, name: "John Doe", email: "john@example.com", segment: "VIP" },
  { id: 2, name: "Sarah Wilson", email: "sarah@example.com", segment: "Regular" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", segment: "New" },
  { id: 4, name: "Emma Davis", email: "emma@example.com", segment: "VIP" },
  { id: 5, name: "Alex Brown", email: "alex@example.com", segment: "Regular" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "sent":
      return <Badge variant="badge-emerald">Sent</Badge>
    case "scheduled":
      return <Badge variant="badge-blue">Scheduled</Badge>
    case "draft":
      return <Badge variant="badge-gray">Draft</Badge>
    case "failed":
      return <Badge variant="badge-rose">Failed</Badge>
    case "active":
      return <Badge variant="badge-emerald">Active</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getTypeBadge(type: string) {
  switch (type) {
    case "transactional":
      return <Badge variant="badge-blue">Transactional</Badge>
    case "marketing":
      return <Badge variant="secondary">Marketing</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export default function EmailsPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false)
  const [isCampaignEditorOpen, setIsCampaignEditorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [selectedRecipients, setSelectedRecipients] = useState("single")
  const [sendOption, setSendOption] = useState("now")
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])

  const [logTypeFilter, setLogTypeFilter] = useState("all")
  const [logStatusFilter, setLogStatusFilter] = useState("all-status")
  const [logSearchTerm, setLogSearchTerm] = useState("")
  const [selectedLogEntries, setSelectedLogEntries] = useState<number[]>([])

  const handleCustomerSelection = (customerId: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers((prev) => [...prev, customerId])
    } else {
      setSelectedCustomers((prev) => prev.filter((id) => id !== customerId))
    }
  }

  const handleSendEmail = () => {
    // Handle email sending logic here
    console.log("Sending email:", {
      recipients: selectedRecipients,
      selectedCustomers,
      subject: emailSubject,
      content: emailContent,
      sendOption,
      scheduleDate,
      attachments,
    })
    setIsComposeOpen(false)
    // Reset form
    setSelectedRecipients("single")
    setSelectedCustomers([])
    setEmailSubject("")
    setEmailContent("")
    setSendOption("now")
    setScheduleDate("")
    setAttachments([])
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const filteredEmailLogs = emailLogs.filter((log) => {
    const matchesType = logTypeFilter === "all" || log.type === logTypeFilter
    const matchesStatus = logStatusFilter === "all-status" || log.status === logStatusFilter
    const matchesSearch =
      logSearchTerm === "" ||
      log.recipient.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.subject.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(logSearchTerm.toLowerCase())

    return matchesType && matchesStatus && matchesSearch
  })

  const handleLogEntrySelection = (logId: number, checked: boolean) => {
    if (checked) {
      setSelectedLogEntries((prev) => [...prev, logId])
    } else {
      setSelectedLogEntries((prev) => prev.filter((id) => id !== logId))
    }
  }

  const handleSelectAllLogs = (checked: boolean) => {
    if (checked) {
      setSelectedLogEntries(filteredEmailLogs.map((log) => log.id))
    } else {
      setSelectedLogEntries([])
    }
  }

  const exportSelectedLogs = () => {
    const selectedLogs = filteredEmailLogs.filter((log) => selectedLogEntries.includes(log.id))
    console.log("Exporting logs:", selectedLogs)
    // Handle export logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage email templates, campaigns, and track all email communications.
          </p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Compose Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Compose New Email</DialogTitle>
              <DialogDescription>Create and send a new email to your customers.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-6 h-[600px]">
              {/* Left Panel - Recipients & Settings */}
              <div className="space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Select value={selectedRecipients} onValueChange={setSelectedRecipients}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Customer</SelectItem>
                      <SelectItem value="multiple">Multiple Customers</SelectItem>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="segment">Customer Segment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRecipients === "single" && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Customer Email</Label>
                    <Input id="email" placeholder="customer@example.com" />
                  </div>
                )}

                {selectedRecipients === "multiple" && (
                  <div className="space-y-2">
                    <Label>Select Customers</Label>
                    <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                      {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`customer-${customer.id}`}
                            checked={selectedCustomers.includes(customer.id)}
                            onCheckedChange={(checked) => handleCustomerSelection(customer.id, checked as boolean)}
                          />
                          <Label htmlFor={`customer-${customer.id}`} className="flex-1 text-sm">
                            <div>{customer.name}</div>
                            <div className="text-xs text-muted-foreground">{customer.email}</div>
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {customer.segment}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedCustomers.length} customer(s) selected</p>
                  </div>
                )}

                {selectedRecipients === "segment" && (
                  <div className="space-y-2">
                    <Label htmlFor="segment">Customer Segment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                        <SelectItem value="regular">Regular Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                        <SelectItem value="inactive">Inactive Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="send-option">Send Option</Label>
                  <Select value={sendOption} onValueChange={setSendOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select send option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send Now</SelectItem>
                      <SelectItem value="schedule">Schedule Later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {sendOption === "schedule" && (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Schedule Date & Time</Label>
                    <Input
                      id="schedule-date"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <div className="space-y-2">
                    <Input id="attachments" type="file" multiple onChange={handleFileUpload} className="hidden" />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("attachments")?.click()}>
                      <Paperclip className="mr-2 h-4 w-4" />
                      Add Files
                    </Button>
                    {attachments.length > 0 && (
                      <div className="space-y-1">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-xs p-2 bg-muted rounded">
                            <span className="truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="h-4 w-4 p-0"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Email Content */}
              <div className="col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Write your email message here..."
                    className="min-h-[400px]"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {sendOption === "now"
                      ? "Email will be sent immediately"
                      : scheduleDate
                        ? `Scheduled for ${new Date(scheduleDate).toLocaleString()}`
                        : "Select a date and time to schedule"}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail}>
                <Send className="mr-2 h-4 w-4" />
                {sendOption === "now" ? "Send Now" : "Schedule Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Users className="mr-2 h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Mail className="mr-2 h-4 w-4" />
            Email Logs
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Calendar className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search templates..." className="pl-10" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{getTypeBadge(template.type)}</TableCell>
                        <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                        <TableCell className="text-muted-foreground">{template.lastModified}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template)
                                setIsTemplateEditorOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Campaigns</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCampaign(null)
                  setIsCampaignEditorOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{campaign.date}</TableCell>
                      <TableCell>{campaign.openRate}</TableCell>
                      <TableCell>{campaign.clickRate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign)
                              setIsCampaignEditorOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Email Logs</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                {selectedLogEntries.length > 0 && (
                  <Button variant="outline" size="sm" onClick={exportSelectedLogs}>
                    <Download className="mr-2 h-4 w-4" />
                    Export ({selectedLogEntries.length})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by recipient, subject, or name..."
                      className="pl-10"
                      value={logSearchTerm}
                      onChange={(e) => setLogSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={logTypeFilter} onValueChange={setLogTypeFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={logStatusFilter} onValueChange={setLogStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">All Status</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedLogEntries.length === filteredEmailLogs.length && filteredEmailLogs.length > 0
                            }
                            onCheckedChange={handleSelectAllLogs}
                          />
                        </TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Engagement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmailLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedLogEntries.includes(log.id)}
                              onCheckedChange={(checked) => handleLogEntrySelection(log.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.recipientName}</div>
                              <div className="text-sm text-muted-foreground">{log.recipient}</div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={log.subject}>
                              {log.subject}
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(log.type)}</TableCell>
                          <TableCell className="text-muted-foreground">{log.template}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(log.status)}
                              {log.status === "failed" && log.failureReason && (
                                <div className="text-xs text-red-600">{log.failureReason}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">{log.date}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {log.openedAt && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <Eye className="h-3 w-3" />
                                  Opened
                                </div>
                              )}
                              {log.clickedAt && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <Mail className="h-3 w-3" />
                                  Clicked
                                </div>
                              )}
                              {log.bounced && (
                                <div className="flex items-center gap-1 text-xs text-red-600">
                                  <RefreshCw className="h-3 w-3" />
                                  Bounced
                                </div>
                              )}
                              {log.unsubscribed && (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <Users className="h-3 w-3" />
                                  Unsubscribed
                                </div>
                              )}
                              {!log.openedAt &&
                                !log.clickedAt &&
                                !log.bounced &&
                                !log.unsubscribed &&
                                log.status === "sent" && (
                                  <div className="text-xs text-muted-foreground">No activity</div>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredEmailLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No email logs found matching your criteria.
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Showing {filteredEmailLogs.length} of {emailLogs.length} email logs
                    {selectedLogEntries.length > 0 && (
                      <span className="ml-2">({selectedLogEntries.length} selected)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <span>Page 1 of 1</span>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,847</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Through Rate</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.4%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">-8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Email Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Email analytics chart would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EmailTemplateEditor
        template={selectedTemplate}
        isOpen={isTemplateEditorOpen}
        onClose={() => {
          setIsTemplateEditorOpen(false)
          setSelectedTemplate(null)
        }}
        onSave={(template) => {
          console.log("Saving template:", template)
          // Handle template save logic here
        }}
      />

      <EmailCampaignEditor
        campaign={selectedCampaign}
        isOpen={isCampaignEditorOpen}
        onClose={() => {
          setIsCampaignEditorOpen(false)
          setSelectedCampaign(null)
        }}
        onSave={(campaign) => {
          console.log("Saving campaign:", campaign)
          // Handle campaign save logic here
        }}
      />
    </div>
  )
}
