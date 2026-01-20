import { NextRequest, NextResponse } from 'next/server'
import { TaskRepository } from '@/lib/db/repositories/task.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const taskRepository = new TaskRepository()

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
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const assignee_id = searchParams.get('assignee_id')
    const created_by = searchParams.get('created_by')

    const result = await taskRepository.findAll({
      page,
      limit,
      search,
      status,
      priority,
      assignee_id: assignee_id ? parseInt(assignee_id) : undefined,
      created_by: created_by ? parseInt(created_by) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('获取任务列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取任务列表失败' },
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

    const task = await taskRepository.create(body)

    return NextResponse.json({
      success: true,
      data: task,
    }, { status: 201 })
  } catch (error: any) {
    console.error('创建任务失败:', error)
    
    if (error.code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 400 }
    )
  }
}
