import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '搜索用户失败' },
      { status: 500 }
    )
  }
}
