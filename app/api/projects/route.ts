import { NextRequest, NextResponse } from 'next/server'
import { ProjectRepository } from '@/lib/db/repositories/project.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const projectRepository = new ProjectRepository()

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
    const manager_id = searchParams.get('manager_id')
    const type = searchParams.get('type')

    const result = await projectRepository.findAll({
      page,
      limit,
      search,
      status,
      priority,
      manager_id: manager_id ? parseInt(manager_id) : undefined,
      type,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('获取项目列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取项目列表失败' },
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

    const project = await projectRepository.create(body)

    return NextResponse.json({
      success: true,
      data: project,
    }, { status: 201 })
  } catch (error: any) {
    console.error('创建项目失败:', error)
    
    if (error.code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '创建项目失败' },
      { status: 400 }
    )
  }
}
