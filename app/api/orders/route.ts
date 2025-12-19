import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/orders - جلب جميع الطلبات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
        { customer: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        }}
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  isDigital: true
                }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST /api/orders - إنشاء طلب جديد
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const order = await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        customer: data.customerId ? {
          connect: { id: data.customerId }
        } : undefined,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        subtotal: parseFloat(data.subtotal),
        taxAmount: parseFloat(data.taxAmount || '0'),
        shippingAmount: parseFloat(data.shippingAmount || '0'),
        discountAmount: parseFloat(data.discountAmount || '0'),
        total: parseFloat(data.total),
        currencyCode: data.currencyCode || 'SAR',
        status: data.status || 'PENDING',
        paymentStatus: data.paymentStatus || 'PENDING',
        fulfillmentStatus: data.fulfillmentStatus || 'UNFULFILLED',
        shippingAddress: JSON.stringify(data.shippingAddress),
        billingAddress: JSON.stringify(data.billingAddress),
        paymentMethod: data.paymentMethod,
        paymentGateway: data.paymentGateway,
        transactionId: data.transactionId,
        notes: data.notes,
        items: {
          create: data.items.map((item: any) => ({
            product: item.productId ? {
              connect: { id: item.productId }
            } : undefined,
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: parseFloat(item.total)
          }))
        }
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}