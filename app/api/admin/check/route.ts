import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

/**
 * Admin Check API - 서버 사이드에서 안전하게 관리자 권한 확인
 * Firebase ID Token을 검증하고 Custom Claims 또는 이메일 확인
 */
export async function GET(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { isAdmin: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.split('Bearer ')[1]

    // Firebase ID Token 검증
    const decodedToken = await adminAuth.verifyIdToken(token)

    // Custom Claims로 admin 체크 (향후 Firebase Console에서 설정)
    if (decodedToken.admin === true) {
      return NextResponse.json({ isAdmin: true, method: 'custom-claims' })
    }

    // Fallback: 환경 변수로 admin 이메일 체크 (서버 사이드에서만)
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && decodedToken.email === adminEmail) {
      return NextResponse.json({ isAdmin: true, method: 'env-email' })
    }

    return NextResponse.json({ isAdmin: false })
  } catch (error: any) {
    logger.error('Admin check error:', error)

    return NextResponse.json(
      { isAdmin: false, error: 'Invalid token' },
      { status: 401 }
    )
  }
}
