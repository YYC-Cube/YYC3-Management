import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    return NextResponse.json({
      success: true,
      message: '通知已标记为已读'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '标记通知失败' },
      { status: 400 }
    )
  }
}
