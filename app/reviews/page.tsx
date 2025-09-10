"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Reply, Trash2, Star, MessageSquare, TrendingUp, AlertTriangle } from "lucide-react"
import { ReviewResponseDialog } from "@/components/review-response-dialog"

// Mock reviews data
const mockReviews = [
  {
    id: "REV-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Wireless Headphones",
      id: "PROD-001",
    },
    rating: 5,
    title: "Excellent sound quality!",
    content:
      "These headphones exceeded my expectations. The sound quality is crystal clear and the battery life is amazing. Highly recommend!",
    date: "2024-01-15",
    status: "published",
    helpful: 12,
    response: null,
    verified: true,
  },
  {
    id: "REV-002",
    customer: {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Smart Watch",
      id: "PROD-002",
    },
    rating: 4,
    title: "Great features, minor issues",
    content:
      "Love the fitness tracking features and the display is beautiful. However, the battery could last longer. Overall satisfied with the purchase.",
    date: "2024-01-14",
    status: "published",
    helpful: 8,
    response: {
      content: "Thank you for your feedback! We're working on improving battery life in future updates.",
      date: "2024-01-15",
      author: "Store Admin",
    },
    verified: true,
  },
  {
    id: "REV-003",
    customer: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Bluetooth Speaker",
      id: "PROD-003",
    },
    rating: 2,
    title: "Disappointing quality",
    content:
      "The speaker arrived with scratches and the sound quality is not as advertised. Expected much better for the price.",
    date: "2024-01-13",
    status: "flagged",
    helpful: 3,
    response: null,
    verified: true,
  },
  {
    id: "REV-004",
    customer: {
      name: "Emma Davis",
      email: "emma@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Laptop Stand",
      id: "PROD-004",
    },
    rating: 5,
    title: "Perfect for my setup",
    content: "Exactly what I needed for my home office. Sturdy, adjustable, and looks great. Fast shipping too!",
    date: "2024-01-12",
    status: "published",
    helpful: 15,
    response: {
      content: "We're thrilled you love your new laptop stand! Thank you for choosing us.",
      date: "2024-01-13",
      author: "Store Admin",
    },
    verified: true,
  },
  {
    id: "REV-005",
    customer: {
      name: "Alex Brown",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Phone Case",
      id: "PROD-005",
    },
    rating: 3,
    title: "Average quality",
    content: "The case does its job but feels a bit cheap. Color is nice though.",
    date: "2024-01-11",
    status: "pending",
    helpful: 2,
    response: null,
    verified: false,
  },
  {
    id: "REV-006",
    customer: {
      name: "Lisa Chen",
      email: "lisa@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    product: {
      name: "Gaming Mouse",
      id: "PROD-006",
    },
    rating: 5,
    title: "Best gaming mouse ever!",
    content: "Incredible precision and comfort. The RGB lighting is a nice touch. Perfect for long gaming sessions.",
    date: "2024-01-10",
    status: "published",
    helpful: 20,
    response: null,
    verified: true,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{rating}</span>
    </div>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case "published":
      return (
        <Badge variant="success">
          Published
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="warning">
          Pending
        </Badge>
      )
    case "flagged":
      return (
        <Badge variant="danger">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Flagged
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<(typeof mockReviews)[0] | null>(null)
  const [isResponseOpen, setIsResponseOpen] = useState(false)

  // Filter reviews based on search, status, and rating
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesStatus && matchesRating
  })

  const handleRespondToReview = (review: (typeof mockReviews)[0]) => {
    setSelectedReview(review)
    setIsResponseOpen(true)
  }

  const handleDeleteReview = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId))
  }

  const handleUpdateReviewStatus = (reviewId: string, newStatus: string) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, status: newStatus } : review)))
  }

  const handleSaveResponse = (reviewId: string, responseContent: string) => {
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              response: {
                content: responseContent,
                date: new Date().toISOString().split("T")[0],
                author: "Store Admin",
              },
            }
          : review,
      ),
    )
    setIsResponseOpen(false)
  }

  // Calculate summary stats
  const totalReviews = reviews.length
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const pendingReviews = reviews.filter((r) => r.status === "pending").length
  const flaggedReviews = reviews.filter((r) => r.status === "flagged").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reviews</h1>
        <p className="text-muted-foreground mt-2">Manage customer reviews and feedback for your products.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <StarRating rating={Math.round(averageRating)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{flaggedReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                          <AvatarFallback>
                            {review.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {review.customer.name}
                            {review.verified && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{review.customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{review.product.name}</div>
                      <div className="text-xs text-muted-foreground">{review.product.id}</div>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={review.rating} />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="font-medium text-sm mb-1">{review.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{review.content}</div>
                      {review.response && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                          <div className="font-medium">Admin Response:</div>
                          <div className="text-muted-foreground">{review.response.content}</div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">{review.helpful} helpful</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{review.date}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRespondToReview(review)}>
                            <Reply className="mr-2 h-4 w-4" />
                            {review.response ? "Edit Response" : "Respond"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateReviewStatus(review.id, "published")}>
                            Publish
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateReviewStatus(review.id, "flagged")}>
                            Flag Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteReview(review.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile two-line layout for reviews */}
          <div className="md:hidden">
            <div className="divide-y">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-4 space-y-3">
                  {/* Line 1: Customer Name + Star Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                        <AvatarFallback>
                          {review.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {review.customer.name}
                          {review.verified && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    {getStatusBadge(review.status)}
                  </div>

                  {/* Line 2: Review Text + Date */}
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium text-sm">{review.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">{review.content}</div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>{review.date}</span>
                        <span>•</span>
                        <span>{review.product.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{review.helpful} helpful</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleRespondToReview(review)}>
                              <Reply className="mr-2 h-4 w-4" />
                              {review.response ? "Edit Response" : "Respond"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateReviewStatus(review.id, "published")}>
                              Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateReviewStatus(review.id, "flagged")}>
                              Flag Review
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    {review.response && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <div className="font-medium">Admin Response:</div>
                        <div className="text-muted-foreground">{review.response.content}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Response Dialog */}
      <ReviewResponseDialog
        open={isResponseOpen}
        onOpenChange={setIsResponseOpen}
        review={selectedReview}
        onSave={handleSaveResponse}
      />
    </div>
  )
}
