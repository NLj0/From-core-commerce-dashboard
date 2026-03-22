import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unlink } from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()
const MAX_IMAGES = 5
const MAX_VIDEOS = 1

const resolveUploadPath = (fileUrl: string): string | null => {
  if (typeof fileUrl !== 'string' || !fileUrl.startsWith('/uploads/')) {
    return null
  }
  const relativePath = fileUrl.replace(/^\/+/, '')
  const normalized = path.normalize(relativePath)
  if (!normalized.startsWith(`uploads${path.sep}`)) {
    return null
  }
  return path.join(process.cwd(), 'public', normalized)
}

// دالة مساعدة لحذف الملفات من النظام
const deleteFileFromDisk = async (fileUrl: string) => {
  const filePath = resolveUploadPath(fileUrl)
  if (!filePath) return
  try {
    await unlink(filePath)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn(`Failed to delete file: ${fileUrl}`, error)
    }
    // لا نرجع خطأ هنا - المنتج سيتم حذفه من قاعدة البيانات حتى لو فشل حذف الملف
  }
}

// دالة لحذف جميع الصور والفيديوهات المرتبطة بمنتج
const deleteProductMediaFiles = async (images: string[], videos: string[]) => {
  const allMediaUrls = [...images, ...videos]
  for (const url of allMediaUrls) {
    if (url && typeof url === 'string' && url.startsWith('/uploads/')) {
      await deleteFileFromDisk(url)
    }
  }
}

const DIGITAL_PRODUCT_TYPES = new Set(["digital", "digital-card", "service"])
const DIGITAL_DELIVERY_METHODS = new Set(["download", "code", "file", "email", "order-page", "custom-fields"])

const parseInteger = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value)
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

const parseFloatValue = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

const parseDateToISO = (value: unknown): string | null => {
  if (!value) return null
  
  if (typeof value === "string" && value.trim() !== "") {
    const trimmed = value.trim()
    // If it's already in ISO format, return it
    if (trimmed.includes('T') || trimmed.length > 10) {
      try {
        new Date(trimmed).toISOString()
        return trimmed
      } catch {
        return null
      }
    }
    // If it's just a date (YYYY-MM-DD), convert to ISO datetime
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return `${trimmed}T00:00:00Z`
    }
  }
  
  return null
}

const normalizeImagesInput = (
  value: unknown,
  mainImageCandidate?: unknown,
): { ordered: string[]; mainImage: string | null } => {
  const collected: string[] = []

  const push = (url?: string | null) => {
    if (!url) return
    const clean = url.trim()
    if (!clean) return
    if (!collected.includes(clean)) {
      collected.push(clean)
    }
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item === "string") {
        push(item)
      }
    })
  } else if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (typeof item === "string") {
            push(item)
          }
        })
      } else {
        push(value)
      }
    } catch {
      push(value)
    }
  }

  const candidate = typeof mainImageCandidate === "string" ? mainImageCandidate.trim() : ""
  const mainImage = candidate || collected[0] || null

  const ordered = mainImage
    ? [mainImage, ...collected.filter((img) => img !== mainImage)]
    : collected

  return { ordered: ordered.slice(0, MAX_IMAGES), mainImage }
}

const normalizeVideosInput = (value: unknown): string[] => {
  const collected: string[] = []

  const push = (url?: string | null) => {
    if (!url) return
    const clean = url.trim()
    if (!clean) return
    if (!collected.includes(clean)) {
      collected.push(clean)
    }
  }

  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (typeof item === 'string') {
        push(item)
      }
    })
  } else if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (typeof item === 'string') {
            push(item)
          }
        })
      } else {
        push(value)
      }
    } catch {
      push(value)
    }
  }

  return collected.slice(0, MAX_VIDEOS)
}

const parseImagesField = (value: string | null | undefined): string[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    }
  } catch (error) {
    console.warn("Failed to parse stored images", error)
  }
  return []
}

const parseVideosField = (value: string | null | undefined): string[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    }
  } catch (error) {
    console.warn("Failed to parse stored videos", error)
  }
  return []
}

const withMainImage = <T extends { images?: string | null }>(record: T) => {
  const parsedImages = parseImagesField(record.images)
  return {
    ...record,
    image: parsedImages[0] ?? null,
  }
}

const collectRemovedMedia = (previous: string[], next: string[], explicit?: unknown): string[] => {
  const nextSet = new Set(next)
  const removed = new Set<string>()

  if (Array.isArray(explicit)) {
    explicit.forEach((item) => {
      if (typeof item === 'string' && item.startsWith('/uploads/')) {
        removed.add(item)
      }
    })
  }

  previous.forEach((url) => {
    if (!nextSet.has(url)) {
      removed.add(url)
    }
  })

  return Array.from(removed)
}

const normalizeCodes = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : typeof item === "number" ? String(item) : ""))
    .filter((item): item is string => item.length > 0)
}

const buildDigitalSettingsString = (payload: any): string => {
  if (payload && typeof payload.digitalSettings === "string") {
    return payload.digitalSettings
  }
  try {
    return JSON.stringify({
      deliveryMethod: payload?.deliveryMethod ?? null,
      downloadLink: payload?.downloadLink ?? null,
      expirationDays: payload?.expirationDays ?? null,
      codes: normalizeCodes(payload?.codes),
      deliveryTime: payload?.deliveryTime ?? null,
      deliveryType: payload?.deliveryType ?? null,
      emailMessage: payload?.emailMessage ?? null,
      customFields: Array.isArray(payload?.customFields) ? payload.customFields : [],
      bundleDelivery: payload?.bundleDelivery ?? null,
    })
  } catch (error) {
    console.warn("Failed to serialize digital settings:", error)
    return "{}"
  }
}

const deriveIsDigital = (data: any): boolean => {
  if (typeof data?.isDigital === "boolean") {
    return data.isDigital
  }
  if (typeof data?.productType === "string" && DIGITAL_PRODUCT_TYPES.has(data.productType)) {
    return true
  }
  if (typeof data?.deliveryMethod === "string") {
    return DIGITAL_DELIVERY_METHODS.has(data.deliveryMethod)
  }
  return false
}

const deriveUnlimitedStock = (data: any, isDigital: boolean): boolean => {
  if (typeof data?.unlimitedStock === "boolean") {
    return data.unlimitedStock
  }
  return isDigital && !["shipping", "pickup"].includes(data?.deliveryMethod as string)
}

const deriveQuantity = (data: any, isDigital: boolean, codes: string[], unlimitedStock: boolean): number => {
  const stockValue =
    parseInteger(data?.quantity) ??
    parseInteger(data?.stock) ??
    0

  if (isDigital) {
    if (unlimitedStock) {
      return 999999
    }
    if (codes.length > 0) {
      return codes.length
    }
  }

  return stockValue
}

const deriveTrackQuantity = (isDigital: boolean, unlimitedStock: boolean, codes: string[]): boolean => {
  if (unlimitedStock) {
    return false
  }
  if (isDigital) {
    return codes.length > 0
  }
  return true
}

// GET /api/products/[id] - جلب منتج واحد
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

  return NextResponse.json(withMainImage(product))
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { images: true, videos: true },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const previousImages = parseImagesField(existingProduct.images)
    const previousVideos = parseVideosField(existingProduct.videos)
    
    const normalizedCodes = normalizeCodes(data.codes)
    const isDigital = deriveIsDigital(data)
    const unlimitedStock = deriveUnlimitedStock(data, isDigital)
    const quantity = deriveQuantity(data, isDigital, normalizedCodes, unlimitedStock)
    const trackQuantity = deriveTrackQuantity(isDigital, unlimitedStock, normalizedCodes)
    const digitalSettings = buildDigitalSettingsString({ ...data, codes: normalizedCodes })

    const { ordered: imagesArray } = normalizeImagesInput(data.images, data.image ?? data.mainImage)
    const videosArray = normalizeVideosInput(data.videos)

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        nameAr: data.nameArabic ?? data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionArabic ?? data.descriptionAr,
        slug: data.slug,
        sku: data.sku,
        price: parseFloatValue(data.salePrice) ?? parseFloatValue(data.basePrice) ?? parseFloatValue(data.price) ?? 0,
        basePrice: parseFloatValue(data.basePrice),
        salePrice: parseFloatValue(data.salePrice),
        comparePrice: parseFloatValue(data.comparePrice),
        costPrice: parseFloatValue(data.costPrice),
        discountType: data.discountType,
        discountValue: parseFloatValue(data.discountValue),
        discountStartDate: parseDateToISO(data.discountStartDate),
        discountEndDate: parseDateToISO(data.discountEndDate),
        totalSales: parseInteger(data.totalSales) ?? undefined,
        totalRevenue: parseFloatValue(data.totalRevenue) ?? undefined,
        netProfit: parseFloatValue(data.netProfit) ?? undefined,
        displayedDiscountRate: parseFloatValue(data.displayedDiscountRate) ?? undefined,
        averageRating: parseFloatValue(data.averageRating) ?? undefined,
        quantity,
        stock: parseInteger(data.stock),
        unlimitedStock: data.unlimitedStock ?? false,
        minQuantity: isDigital ? 0 : parseInteger(data.minQuantity) ?? 0,
  images: JSON.stringify(imagesArray),
        videos: JSON.stringify(videosArray),
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        promotionalTitle: data.promotionalTitle,
        allowRepeatPurchase: data.allowRepeatPurchase ?? true,
        preventDiscount: data.preventDiscount ?? false,
        productType: data.productType,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isDigital,
        trackQuantity,
        digitalSettings,
        category: data.categoryId
          ? {
              connect: { id: data.categoryId },
            }
          : {
              disconnect: true,
            },
      },
      include: {
        category: true,
      },
    })

    const removedImagesList = collectRemovedMedia(previousImages, imagesArray, data.removedImages)
    const removedVideosList = collectRemovedMedia(previousVideos, videosArray, data.removedVideos)

    if (removedImagesList.length || removedVideosList.length) {
      await deleteProductMediaFiles(removedImagesList, removedVideosList)
    }

    return NextResponse.json(withMainImage(product))
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - حذف منتج مع حذف الملفات المرتبطة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // الحصول على المنتج أولاً للحصول على الصور والفيديوهات
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        images: true,
        videos: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // حذف الملفات من النظام
    let parsedImages: string[] = []
    let parsedVideos: string[] = []

    if (typeof product.images === 'string') {
      try {
        parsedImages = JSON.parse(product.images)
      } catch (e) {
        parsedImages = []
      }
    }

    parsedImages = parseImagesField(product.images)
    parsedVideos = parseVideosField(product.videos)

    await deleteProductMediaFiles(parsedImages, parsedVideos)

    // حذف المنتج من قاعدة البيانات
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[id] - حذف صورة واحدة من المنتج
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { imageToDelete } = body

    if (!imageToDelete) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      )
    }

    // حذف الملف من النظام
    if (typeof imageToDelete === 'string' && imageToDelete.startsWith('/uploads/')) {
      await deleteFileFromDisk(imageToDelete)
    }

    // الحصول على المنتج الحالي
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        images: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // تحديث الصور
    let currentImages = parseImagesField(product.images)

    const updatedImages = currentImages.filter((img) => img !== imageToDelete)

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        images: JSON.stringify(updatedImages),
      },
      include: { category: true },
    })

    return NextResponse.json(withMainImage(updatedProduct))
  } catch (error) {
    console.error('Image deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}