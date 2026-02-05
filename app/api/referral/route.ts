import { NextRequest, NextResponse } from 'next/server'
import {
  assignReferralCode,
  applyReferralCode,
  getReferralStats,
} from '@/lib/referral/referral-admin'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * GET: Get referral stats for user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const stats = await getReferralStats(userId)

    return NextResponse.json(stats)
  } catch (error: any) {
    logger.error('[Referral API] GET error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get referral stats' },
      { status: 500 }
    )
  }
}

/**
 * POST: Generate referral code OR apply referral code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, referralCode } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (action === 'generate') {
      // Generate referral code for user
      const code = await assignReferralCode(userId)
      return NextResponse.json({ referralCode: code })
    } else if (action === 'apply') {
      // Apply referral code
      if (!referralCode) {
        return NextResponse.json(
          { error: 'Referral code is required' },
          { status: 400 }
        )
      }

      const result = await applyReferralCode(userId, referralCode)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    logger.error('[Referral API] POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process referral action' },
      { status: 500 }
    )
  }
}
