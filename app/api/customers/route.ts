import { NextRequest, NextResponse } from 'next/server'
import { CustomerRepository } from '@/lib/db/repositories/customer.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const customerRepository = new CustomerRepository()

export async function GET(request: NextRequest) {
  try {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const level = searchParams.get('level') || ''
    const status = searchParams.get('status') || ''

    const result = await customerRepository.findAll({
      page,
      limit,
      search,
      level,
      status,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('获取客户列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取客户列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const body = await request.json()

    const customer = await customerRepository.create(body)

    return NextResponse.json({
      success: true,
      data: customer,
    }, { status: 201 })
  } catch (error: any) {
    console.error('创建客户失败:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: '客户邮箱已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建客户失败' },
      { status: 400 }
    )
  }
}
