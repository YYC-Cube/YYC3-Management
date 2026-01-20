import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    return NextResponse.json({
      success: true,
      data: {}
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新任务状态失败' },
      { status: 400 }
    )
  }
}
