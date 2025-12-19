import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
}

// GET /api/categories - جلب جميع الفئات
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isActive = searchParams.get('isActive')
    const parentId = searchParams.get('parentId')

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }
    if (parentId) {
      where.parentId = parentId
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        children: true,
        parent: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    }) as any

    const formattedCategories = categories.map((cat: any) => ({
      ...cat,
      productsCount: cat._count.products,
      status: cat.isActive ? 'active' : 'inactive',
      createdDate: cat.createdAt.toISOString().split('T')[0],
      seo: {
        metaTitle: cat.metaTitle || '',
        metaDescription: cat.metaDescription || '',
        keywords: cat.keywords || ''
      }
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - إنشاء فئة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      descriptionAr,
      image,
      status,
      seo = {},
      parentId
    } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const slug = generateSlug(name)

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        descriptionAr: descriptionAr?.trim() || null,
        image: image || null,
        slug,
        isActive: status === 'active',
        metaTitle: seo.metaTitle?.trim() || null,
        metaDescription: seo.metaDescription?.trim() || null,
        keywords: seo.keywords?.trim() || null,
        parent: parentId ? {
          connect: { id: parentId }
        } : undefined
      } as any,
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      }
    }) as any

    return NextResponse.json({
      ...category,
      productsCount: category._count.products,
      status: category.isActive ? 'active' : 'inactive',
      createdDate: category.createdAt.toISOString().split('T')[0],
      seo: {
        metaTitle: category.metaTitle || '',
        metaDescription: category.metaDescription || '',
        keywords: category.keywords || ''
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Category creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
