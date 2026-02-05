import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

export async function POST(request: NextRequest) {
  try {
    const { orderId, tier } = await request.json()

    if (!orderId || !tier) {
      return NextResponse.json(
        { error: 'orderId and tier are required' },
        { status: 400 }
      )
    }

    if (!['basic', 'premium'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // 주문 ID로 기존 처리 여부 확인 (중복 방지)
    const existingOrder = await adminDb
      .collection('orders')
      .where('orderId', '==', orderId)
      .get()

    if (!existingOrder.empty) {
      return NextResponse.json(
        { error: 'Order already processed' },
        { status: 409 }
      )
    }

    // 주문 기록 저장
    await adminDb.collection('orders').add({
      orderId,
      tier,
      status: 'completed',
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Subscription Activate] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
