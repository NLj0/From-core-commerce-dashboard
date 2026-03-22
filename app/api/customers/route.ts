import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/customers - جلب جميع العملاء
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              status: true,
              createdAt: true
            }
          },
          addresses: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ])

    const customersWithStats = customers.map((customer: (typeof customers)[number]) => ({
      ...customer,
      totalOrders: customer.orders.length,
      totalSpent: customer.orders.reduce((sum: number, order: (typeof customer.orders)[number]) => sum + order.total, 0),
      lastOrderDate: customer.orders.length > 0 
        ? customer.orders.sort((a: (typeof customer.orders)[number], b: (typeof customer.orders)[number]) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
        : null
    }))

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Customers API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - إنشاء عميل جديد
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const customer = await prisma.customer.create({
      data: {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        isActive: data.isActive ?? true,
        emailVerified: data.emailVerified ?? false,
        phoneVerified: data.phoneVerified ?? false,
        acceptsMarketing: data.acceptsMarketing ?? false,
        avatar: data.avatar,
        notes: data.notes
      }
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}