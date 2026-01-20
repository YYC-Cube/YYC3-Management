import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
        uptime: 0
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取系统监控数据失败' },
      { status: 500 }
    )
  }
}
