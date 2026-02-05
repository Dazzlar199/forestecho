import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai/config'
import { PREMIUM_ANALYSIS_PROMPT } from '@/lib/openai/prompts'
import { adminDb } from '@/lib/firebase/admin'
import admin from 'firebase-admin'
import type { PsychologicalAnalysis } from '@/types/analysis'
import { rateLimit } from '@/lib/rate-limit-upstash'
import { z } from 'zod'
import { formatZodErrors } from '@/lib/validation/schemas'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 analyses per hour per IP (더 엄격함, 비용이 높은 API)
    const identifier = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
    const rateLimitResult = await rateLimit(identifier, { limit: 3, window: 3600 })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: '분석 요청 한도를 초과했습니다. 1시간 후 다시 시도해주세요.',
          error_en: 'Analysis rate limit exceeded. Please try again in 1 hour.',
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString()
          }
        }
      )
    }

    // 요청 본문 파싱 및 검증
    const body = await request.json()

    // Analysis 요청 스키마
    const AnalysisRequestSchema = z.object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.string().min(1).max(5000),
        })
      ).min(1, '최소 1개의 메시지가 필요합니다.'),
      userId: z.string().min(1, '사용자 ID가 필요합니다.'),
      sessionId: z.string().min(1, '세션 ID가 필요합니다.'),
    })

    // Zod 스키마 검증
    const validationResult = AnalysisRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: '유효하지 않은 요청입니다.',
          error_en: 'Invalid request format.',
          validationErrors: formatZodErrors(validationResult.error),
        },
        { status: 400 }
      )
    }

    const { messages, userId, sessionId } = validationResult.data

    // 로그인 확인 (이미 스키마에서 userId 검증됨)
    if (!userId) {
      return NextResponse.json(
        { error: '로그인이 필요한 서비스입니다.' },
        { status: 401 }
      )
    }

    // 대화 내용을 기반으로 심화 분석 생성 (재시도 로직 포함)
    const conversationSummary = messages
      .map((m: any) => `${m.role === 'user' ? '내담자' : '상담사'}: ${m.content}`)
      .join('\n\n')

    let completion
    let lastError
    const maxRetries = 2

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const startTime = Date.now()

        completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: PREMIUM_ANALYSIS_PROMPT,
            },
            {
              role: 'user',
              content: `다음은 지금까지의 상담 대화입니다:\n\n${conversationSummary}\n\n위 대화를 바탕으로 매우 정밀하고 깊이 있는 전문 심리 분석을 JSON 형식으로 제공해주세요. 모든 필수 필드를 빠짐없이 채우고, 각 배열에는 충분한 항목을 포함해주세요.`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 4096,
        })

        const generationTime = Date.now() - startTime
        logger.info('Analysis generated successfully', {
          attempt: attempt + 1,
          generationTime,
          userId
        })

        break // 성공 시 루프 탈출
      } catch (error: any) {
        lastError = error
        logger.warn(`Analysis generation attempt ${attempt + 1} failed`, {
          error: error.message,
          userId
        })

        if (attempt < maxRetries) {
          // 재시도 전 대기 (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        }
      }
    }

    if (!completion) {
      throw lastError || new Error('분석 생성에 실패했습니다.')
    }

    const analysisContent = completion.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('분석 생성에 실패했습니다.')
    }

    // JSON 파싱 및 검증
    let analysisData: Partial<PsychologicalAnalysis>
    try {
      analysisData = JSON.parse(analysisContent)

      // 필수 필드 검증
      if (!analysisData.summary) {
        throw new Error('summary 필드가 누락되었습니다')
      }
      if (!analysisData.emotionalAnalysis || !analysisData.cognitiveAnalysis) {
        throw new Error('필수 분석 섹션이 누락되었습니다')
      }

      // 배열 최소 길이 검증 (너무 빈약한 분석 방지)
      const checkMinLength = (arr: any[] | undefined, fieldName: string, minLength = 2) => {
        if (arr && arr.length < minLength) {
          logger.warn(`${fieldName}의 항목 수가 부족합니다 (${arr.length} < ${minLength})`)
        }
      }

      checkMinLength(analysisData.emotionalAnalysis?.dominantEmotions, 'dominantEmotions', 2)
      checkMinLength(analysisData.cognitiveAnalysis?.automaticThoughts, 'automaticThoughts', 2)
      checkMinLength(analysisData.coreIssue?.surfaceProblems, 'surfaceProblems', 2)

    } catch (parseError: any) {
      logger.error('JSON parsing error:', {
        error: parseError.message,
        content: analysisContent?.substring(0, 500) // 앞부분만 로깅
      })
      throw new Error('분석 결과 파싱에 실패했습니다: ' + parseError.message)
    }

    // Firestore에 분석 결과 저장 (Admin SDK 사용)
    const analysisDoc = await adminDb.collection('psychologicalAnalyses').add({
      ...analysisData,
      sessionId: sessionId || '',
      userId: userId,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    const fullAnalysis: PsychologicalAnalysis = {
      id: analysisDoc.id,
      sessionId: sessionId || '',
      userId: userId,
      generatedAt: new Date().toISOString(),
      ...analysisData,
    } as PsychologicalAnalysis

    return NextResponse.json({
      analysis: fullAnalysis,
      analysisId: analysisDoc.id,
    })
  } catch (error: any) {
    logger.error('Analysis API Error:', error)

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 유효하지 않습니다.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
