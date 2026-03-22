import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DIGITAL_PRODUCT_TYPES = new Set(["digital", "digital-card", "service"])
const DIGITAL_DELIVERY_METHODS = new Set(["download", "code", "file", "email", "order-page", "custom-fields"])
const MAX_IMAGES = 5
const MAX_VIDEOS = 1

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

const withMainImage = <T extends { images?: string | null }>(record: T) => {
  const parsedImages = parseImagesField(record.images)
  return {
    ...record,
    image: parsedImages[0] ?? null,
  }
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

// GET /api/products - جلب جميع المنتجات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const isDigital = searchParams.get('digital')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (category) {
      where.categoryId = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (isDigital !== null) {
      where.isDigital = isDigital === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            select: {
              rating: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    const productsWithRating = products.map((product: (typeof products)[number]) => {
      const productWithImage = withMainImage(product)
      const averageRating = product.reviews.length > 0 
        ? product.reviews.reduce((sum: number, review: (typeof product.reviews)[number]) => sum + review.rating, 0) / product.reviews.length 
        : 0

      return {
        ...productWithImage,
        averageRating,
        reviewCount: product.reviews.length
      }
    })

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// Function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9أ-ي\s-]/g, '') // Keep Arabic, English, numbers, spaces, hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// POST /api/products - إنشاء منتج جديد
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate slug if not provided
    let slug = data.slug || generateSlug(data.name)
    
    // Check if slug exists and make it unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })
    
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`
    }
    
    const normalizedCodes = normalizeCodes(data.codes)
    const isDigital = deriveIsDigital(data)
    const unlimitedStock = deriveUnlimitedStock(data, isDigital)
    const quantity = deriveQuantity(data, isDigital, normalizedCodes, unlimitedStock)
    const trackQuantity = deriveTrackQuantity(isDigital, unlimitedStock, normalizedCodes)
    const digitalSettings = buildDigitalSettingsString({ ...data, codes: normalizedCodes })

    const { ordered: imagesArray } = normalizeImagesInput(data.images, data.image ?? data.mainImage)

    const videosArray = normalizeVideosInput(data.videos)

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameAr: data.nameArabic ?? data.nameAr,
        description: data.description,
        descriptionAr: data.descriptionArabic ?? data.descriptionAr,
        slug,
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
        totalSales: parseInteger(data.totalSales) ?? 0,
        totalRevenue: parseFloatValue(data.totalRevenue) ?? 0,
        netProfit: parseFloatValue(data.netProfit) ?? 0,
        displayedDiscountRate: parseFloatValue(data.displayedDiscountRate),
        averageRating: parseFloatValue(data.averageRating) ?? 0,
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
          : undefined,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(withMainImage(product), { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
