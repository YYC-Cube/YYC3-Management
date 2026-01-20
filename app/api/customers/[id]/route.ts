import { NextRequest, NextResponse } from 'next/server'
import { CustomerRepository } from '@/lib/db/repositories/customer.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const customerRepository = new CustomerRepository()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const { id } = params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: '无效的客户ID' },
        { status: 400 }
      )
    }

    const customer = await customerRepository.findById(customerId)

    if (!customer) {
      return NextResponse.json(
        { success: false, error: '客户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('获取客户详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取客户详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const { id } = params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: '无效的客户ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const customer = await customerRepository.update(customerId, body)

    if (!customer) {
      return NextResponse.json(
        { success: false, error: '客户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error: any) {
    console.error('更新客户失败:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: '客户邮箱已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: '更新客户失败' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isConnected = await checkDatabaseConnection()
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 503 }
      )
    }

    const { id } = params
    const customerId = parseInt(id)

    if (isNaN(customerId)) {
      return NextResponse.json(
        { success: false, error: '无效的客户ID' },
        { status: 400 }
      )
    }

    const deleted = await customerRepository.delete(customerId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '客户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '客户删除成功',
    })
  } catch (error) {
    console.error('删除客户失败:', error)
    return NextResponse.json(
      { success: false, error: '删除客户失败' },
      { status: 500 }
    )
  }
}
