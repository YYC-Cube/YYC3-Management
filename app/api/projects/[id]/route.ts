import { NextRequest, NextResponse } from 'next/server'
import { ProjectRepository } from '@/lib/db/repositories/project.repository'
import { checkDatabaseConnection } from '@/lib/db/client'

const projectRepository = new ProjectRepository()

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
    const projectId = parseInt(id)

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '无效的项目ID' },
        { status: 400 }
      )
    }

    const project = await projectRepository.findById(projectId)

    if (!project) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error) {
    console.error('获取项目详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取项目详情失败' },
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
    const projectId = parseInt(id)

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '无效的项目ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    const project = await projectRepository.update(projectId, body)

    if (!project) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    })
  } catch (error: any) {
    console.error('更新项目失败:', error)
    
    if (error.code === '23503') {
      return NextResponse.json(
        { success: false, error: '指定的用户不存在' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: '更新项目失败' },
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
    const projectId = parseInt(id)

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: '无效的项目ID' },
        { status: 400 }
      )
    }

    const deleted = await projectRepository.delete(projectId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '项目删除成功',
    })
  } catch (error) {
    console.error('删除项目失败:', error)
    return NextResponse.json(
      { success: false, error: '删除项目失败' },
      { status: 500 }
    )
  }
}
