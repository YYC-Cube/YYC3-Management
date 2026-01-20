import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    return NextResponse.json({
      success: true,
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取通知列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {}
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建通知失败' },
      { status: 400 }
    )
  }
}
