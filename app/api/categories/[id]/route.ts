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

// GET /api/categories/[id] - الحصول على فئة واحدة
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      }
    }) as any

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

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
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// PUT /api/categories/[id] - تحديث فئة
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      descriptionAr,
      image,
      status,
      seo = {}
    } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const slug = generateSlug(name)

    // Check if slug already exists (but allow same category to keep its slug)
    if (slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 })
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        descriptionAr: descriptionAr?.trim() || null,
        image: image || null,
        slug,
        isActive: status === 'active',
        metaTitle: seo.metaTitle?.trim() || null,
        metaDescription: seo.metaDescription?.trim() || null,
        keywords: seo.keywords?.trim() || null
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
      ...updatedCategory,
      productsCount: updatedCategory._count.products,
      status: updatedCategory.isActive ? 'active' : 'inactive',
      createdDate: updatedCategory.createdAt.toISOString().split('T')[0],
      seo: {
        metaTitle: updatedCategory.metaTitle || '',
        metaDescription: updatedCategory.metaDescription || '',
        keywords: updatedCategory.keywords || ''
      }
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - حذف فئة
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
