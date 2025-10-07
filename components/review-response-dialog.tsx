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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"

interface Review {
  id: string
  customer: {
    name: string
    email: string
    avatar: string
  }
  product: {
    name: string
    id: string
  }
  rating: number
  title: string
  content: string
  date: string
  status: string
  helpful: number
  response: {
    content: string
    date: string
    author: string
  } | null
  verified: boolean
}

interface ReviewResponseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  review: Review | null
  onSave: (reviewId: string, response: string) => void
}

function StarRating({ rating, isRTL }: { rating: number; isRTL?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className={`${isRTL ? "mr-1" : "ml-1"} text-sm font-medium`}>{rating}</span>
    </div>
  )
}

export function ReviewResponseDialog({ open, onOpenChange, review, onSave }: ReviewResponseDialogProps) {
  const { t, dir } = useLanguage()
  const isRTL = dir === "rtl"
  const [response, setResponse] = useState("")

  useEffect(() => {
    if (review?.response) {
      setResponse(review.response.content)
    } else {
      setResponse("")
    }
  }, [review])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (review && response.trim()) {
      onSave(review.id, response.trim())
      setResponse("")
    }
  }

  if (!review) return null

  const dialogTitle = review.response ? t("reviews.responseDialog.editTitle") : t("reviews.responseDialog.addTitle")
  const description = t("reviews.responseDialog.description")
  const currentResponseLabel = t("reviews.responseDialog.currentResponse")
  const byAuthorOn = review.response
    ? t("reviews.responseDialog.byAuthorOn")
        .replace("{author}", review.response.author)
        .replace("{date}", review.response.date)
    : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[600px] ${isRTL ? "text-right" : ""}`} dir={dir}>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className={isRTL ? "text-right" : ""}>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Review */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.customer.avatar || "/placeholder.svg"} alt={review.customer.name} />
                <AvatarFallback>
                  {review.customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="font-medium">{review.customer.name}</span>
                  <StarRating rating={review.rating} isRTL={isRTL} />
                </div>
                <div className="text-sm text-muted-foreground">{review.product.name}</div>
              </div>
              <div className="text-sm text-muted-foreground">{review.date}</div>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">{review.title}</div>
              <div className="text-sm text-muted-foreground">{review.content}</div>
            </div>
          </div>

          {/* Current Response (if exists) */}
          {review.response && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="text-sm font-medium mb-2">{currentResponseLabel}</div>
              <div className="text-sm text-muted-foreground">{review.response.content}</div>
              <div className="text-xs text-muted-foreground mt-2">{byAuthorOn}</div>
            </div>
          )}

          {/* Response Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response" className={isRTL ? "flex justify-end" : ""}>
                {t("reviews.responseDialog.fieldLabel")}
              </Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={t("reviews.responseDialog.placeholder")}
                rows={4}
                required
              />
              <div className="text-xs text-muted-foreground">
                {t("reviews.responseDialog.helper")}
              </div>
            </div>

            <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("reviews.responseDialog.cancel")}
              </Button>
              <Button type="submit" disabled={!response.trim()}>
                {review.response
                  ? t("reviews.responseDialog.update")
                  : t("reviews.responseDialog.post")}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
