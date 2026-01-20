import { NextRequest, NextResponse } from 'next/server'
import { TaskRepository } from '@/lib/db/repositories/task.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const taskRepository = new TaskRepository()

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
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: '无效的任务ID' },
        { status: 400 }
      )
    }

    const task = await taskRepository.findById(taskId)

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error) {
    console.error('获取任务详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取任务详情失败' },
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
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: '无效的任务ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const task = await taskRepository.update(taskId, body)

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: task,
    })
  } catch (error: any) {
    console.error('更新任务失败:', error)
    
    if (error.code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '更新任务失败' },
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
    const taskId = parseInt(id)

    if (isNaN(taskId)) {
      return NextResponse.json(
        { success: false, error: '无效的任务ID' },
        { status: 400 }
      )
    }

    const deleted = await taskRepository.delete(taskId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '任务删除成功',
    })
  } catch (error) {
    console.error('删除任务失败:', error)
    return NextResponse.json(
      { success: false, error: '删除任务失败' },
      { status: 500 }
    )
  }
}
