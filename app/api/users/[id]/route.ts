import { NextRequest, NextResponse } from 'next/server'
import { UserRepository } from '@/lib/db/repositories/user.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const userRepository = new UserRepository()

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
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: '无效的用户ID' },
        { status: 400 }
      )
    }

    const user = await userRepository.findById(userId)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户详情失败' },
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
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: '无效的用户ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const user = await userRepository.update(userId, body)

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error: any) {
    console.error('更新用户失败:', error)
    
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: '用户名或邮箱已存在' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { success: false, error: '更新用户失败' },
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
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: '无效的用户ID' },
        { status: 400 }
      )
    }

    const deleted = await userRepository.delete(userId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { success: false, error: '删除用户失败' },
      { status: 500 }
    )
  }
}
