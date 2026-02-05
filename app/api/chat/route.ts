import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel } from '@/lib/gemini/config'
import { ENHANCED_COUNSELOR_PROMPT } from '@/lib/gemini/enhanced-prompts'
import {
  detectCrisisKeywords,
  generateContextualSystemMessage,
  checkResponseQuality,
  type Message,
} from '@/lib/gemini/context-manager'
import {
  filterProhibitedContent,
  detectDangerousIntent,
  validateResponseQuality,
} from '@/lib/gemini/response-filter'
import { enhanceWithResearch } from '@/lib/search/tavily'
import { COUNSELING_MODES, type CounselingMode } from '@/lib/gemini/counseling-modes'
import { rateLimit } from '@/lib/rate-limit-upstash'
import { detectLanguageFromMessages } from '@/lib/utils/language-detector'
import { openai, OPENAI_CONFIG } from '@/lib/openai/config'
import { FREE_TIER_COUNSELOR_PROMPT } from '@/lib/openai/free-tier-prompt'
import {
  checkDailyLimit,
  incrementDailyUsage,
  getModelForTier,
  getUserSubscription,
} from '@/lib/firebase/user-subscription-admin'
import type { UserTier } from '@/types/user'
import { ChatRequestSchema, formatZodErrors } from '@/lib/validation/schemas'
import { z } from 'zod'
import { logger } from '@/lib/utils/logger'

const languageInstructions = {
  ko: '한국어로 답변하세요.',
  en: 'Please respond in English.',
  ja: '日本語で回答してください。',
  zh: '请用中文回答。',
}

// 이성-감정 톤 가이던스 생성
function getToneGuidance(tone: number): string {
  if (tone < 25) {
    // 매우 이성적 (0-24)
    return `매우 이성적이고 분석적인 접근을 사용하세요:
- 논리적이고 체계적인 설명을 제공하세요
- 사실, 데이터, 연구 결과를 적극 활용하세요
- 객관적이고 구체적인 해결 방법을 제시하세요
- 인지행동치료(CBT) 기법과 논리적 분석을 강조하세요
- 이모티콘 사용을 최소화하거나 사용하지 마세요`
  } else if (tone < 45) {
    // 이성 중심 (25-44)
    return `이성적이면서도 따뜻한 접근을 사용하세요:
- 논리적 설명과 함께 공감을 표현하세요
- 연구 기반의 조언을 제공하되 이해하기 쉽게 설명하세요
- 문제 해결 중심의 구체적인 전략을 제시하세요
- 필요한 경우 간단한 이모티콘(1-2개)을 사용하세요`
  } else if (tone <= 55) {
    // 균형 (45-55)
    return `이성과 감성의 균형잡힌 접근을 사용하세요:
- 공감적 이해와 논리적 분석을 적절히 조화하세요
- 감정을 인정하면서 실용적인 해결책을 제시하세요
- 따뜻하면서도 명확한 어조를 유지하세요
- 적절한 이모티콘(2-3개)을 사용하여 친근함을 표현하세요`
  } else if (tone <= 75) {
    // 감성 중심 (56-75)
    return `감성적이고 공감적인 접근을 사용하세요:
- 내담자의 감정에 깊이 공감하고 따뜻하게 반응하세요
- 감정적 지지와 위로를 우선하세요
- 부드럽고 친근한 언어를 사용하세요
- 이모티콘(3-4개)을 자연스럽게 활용하여 따뜻함을 전달하세요
- 필요한 경우 조언도 제공하되, 공감을 먼저 표현하세요`
  } else {
    // 매우 감성적 (76-100)
    return `매우 감성적이고 따뜻한 접근을 사용하세요:
- 내담자의 감정에 완전히 공감하고 깊은 이해를 표현하세요
- 정서적 지지와 위로에 집중하세요
- 매우 따뜻하고 친근하며 부드러운 언어를 사용하세요
- 이모티콘을 적극 활용(4-5개)하여 감정적 연결을 강화하세요
- 조언보다는 함께 있어주는 느낌을 전달하세요`
  }
}

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  logger.info('[Chat API] Request received')

  try {
    // Rate limiting: 10 requests per minute per IP
    const identifier = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
    const rateLimitResult = await rateLimit(identifier, { limit: 10, window: 60 })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
          error_en: 'Rate limit exceeded. Please try again later.',
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

    // Zod 스키마 검증
    const validationResult = ChatRequestSchema.safeParse(body)

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

    const { messages, language: clientLanguage, counselingMode = 'general', responseTone = 50, userId } = validationResult.data

    // 사용자 Tier 및 일일 제한 체크
    let userTier: UserTier = 'guest'
    let selectedModel: 'gpt-4o-mini' | 'gemini-2.0-flash' = 'gpt-4o-mini'

    if (userId) {
      // 로그인한 사용자: Firestore에서 tier 확인
      const limitCheck = await checkDailyLimit(userId)

      if (limitCheck.hasReachedLimit) {
        return NextResponse.json(
          {
            error: '오늘의 무료 대화 횟수를 모두 사용하셨습니다.',
            error_en: 'You have reached your daily conversation limit.',
            errorCode: 'DAILY_LIMIT_REACHED',
            tier: limitCheck.tier,
            upgradeRequired: true,
          },
          { status: 429 }
        )
      }

      userTier = limitCheck.tier
      selectedModel = getModelForTier(userTier)

      // 사용 횟수 증가 (비동기로 백그라운드 처리)
      incrementDailyUsage(userId).catch((err) =>
        logger.error('Failed to increment daily usage:', err)
      )
    } else {
      // 비로그인 사용자: 게스트 (이미 프론트엔드에서 3회 제한 처리됨)
      userTier = 'guest'
      selectedModel = 'gpt-4o-mini'
    }

    // 언어 자동 감지: 클라이언트가 보낸 언어 OR 최근 메시지에서 자동 감지
    const detectedLanguage = clientLanguage || detectLanguageFromMessages(messages)
    const language = detectedLanguage

    // 위기 상황 감지
    const latestUserMessage = messages.filter((m: Message) => m.role === 'user').slice(-1)[0]?.content || ''
    const isCrisis = detectCrisisKeywords(latestUserMessage)

    // 위험한 의도 사전 감지 (앱인토스 필터)
    const dangerousIntent = detectDangerousIntent(latestUserMessage)
    if (dangerousIntent.isDangerous) {
      logger.warn('🚨 Dangerous intent detected, blocking request', {
        category: dangerousIntent.category,
        severity: dangerousIntent.severity,
      })

      // 위험한 요청 즉시 차단
      return NextResponse.json(
        {
          error: '죄송합니다. 해당 내용에 대한 답변을 제공할 수 없습니다.',
          error_en: 'Sorry, we cannot provide an answer to that content.',
          errorCode: 'PROHIBITED_CONTENT',
          category: dangerousIntent.category,
        },
        { status: 400 }
      )
    }

    // 맥락 기반 시스템 메시지
    const contextualGuidance = generateContextualSystemMessage(messages, {
      riskLevel: isCrisis ? 'high' : 'low',
    })

    // 심리학 지식 베이스 검색 (RAG)
    let knowledgeContext = ''

    if (userTier === 'basic' || userTier === 'premium') {
      // 유료 tier만 RAG 사용 (비용 최적화)
      try {
        const { searchRelevantKnowledge } = await import('@/lib/rag/search')
        const conversationContext = messages.slice(-3).map((m: Message) => m.content)
        knowledgeContext = await searchRelevantKnowledge(latestUserMessage, conversationContext)
      } catch (error) {
        logger.warn('RAG search failed, skipping knowledge enhancement:', error)
        // RAG 실패 시 그냥 스킵 (Tavily도 없으면 비용 발생)
        knowledgeContext = ''
      }
    }

    // Tier별 프롬프트 선택
    let modePrompt: string
    if (selectedModel === 'gpt-4o-mini') {
      // 무료 tier: 간결한 프롬프트
      modePrompt = FREE_TIER_COUNSELOR_PROMPT
    } else {
      // 유료 tier: 전문 상담 모드 + 고도화 프롬프트
      modePrompt = COUNSELING_MODES[counselingMode as CounselingMode]?.prompt || ENHANCED_COUNSELOR_PROMPT
    }

    // 시스템 프롬프트 구성
    let systemPrompt = modePrompt + '\n\n' + contextualGuidance

    // 언어 설정 추가 (자동 감지된 언어로 강제)
    const languageInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.ko
    systemPrompt += `\n\n**CRITICAL LANGUAGE REQUIREMENT**: The user is communicating in ${language === 'ko' ? 'Korean (한국어)' : language === 'en' ? 'English' : language === 'ja' ? 'Japanese (日本語)' : 'Chinese (中文)'}. You MUST respond in the SAME language. ${languageInstruction}`

    // 이성-감정 톤 조정 (0: 이성적, 100: 감성적)
    const toneGuidance = getToneGuidance(responseTone)
    systemPrompt += `\n\n**답변 스타일 가이드**: ${toneGuidance}`

    if (isCrisis) {
      systemPrompt += `\n\n⚠️ 위기 상황 감지됨. 안전 최우선 프로토콜 적용.`
    }

    // 검색된 심리학 지식 추가
    if (knowledgeContext && knowledgeContext.length > 50) {
      systemPrompt += `\n\n${knowledgeContext}\n\n위 심리학 지식을 참고하여 증거 기반의 전문적인 조언을 제공하세요. 적절한 경우 기법 이름이나 이론을 언급하되, 자연스럽게 통합하세요.`
    }

    // 스트리밍 응답을 위한 ReadableStream 생성
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''

        try {
          if (selectedModel === 'gpt-4o-mini') {
            // ===== OpenAI GPT-4o-mini =====
            const openaiMessages = [
              { role: 'system' as const, content: systemPrompt },
              ...messages.map((m: Message) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content,
              })),
            ]

            const stream = await openai.chat.completions.create({
              ...OPENAI_CONFIG,
              messages: openaiMessages,
              stream: true,
            })

            for await (const chunk of stream) {
              const chunkText = chunk.choices[0]?.delta?.content || ''
              if (chunkText) {
                fullResponse += chunkText
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText })}\n\n`))
              }
            }
          } else {
            // ===== Gemini 2.0 Flash =====
            const geminiHistory = messages.slice(0, -1).map((msg: Message) => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }],
            }))

            const geminiModel = getGeminiModel()
            const chat = geminiModel.startChat({
              history: geminiHistory,
              systemInstruction: systemPrompt,
            })

            const result = await chat.sendMessageStream(latestUserMessage)

            for await (const chunk of result.stream) {
              const chunkText = chunk.text()
              if (chunkText) {
                fullResponse += chunkText
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunkText })}\n\n`))
              }
            }
          }

          // 🚨 앱인토스 필터: 금지 콘텐츠 검사
          const filterResult = filterProhibitedContent(fullResponse)

          if (filterResult.isBlocked) {
            logger.warn('🚨 Prohibited content in response, replacing with safe message', {
              reason: filterResult.reason,
              severity: filterResult.severity,
            })

            // 금지 콘텐츠 감지 시 안전한 응답으로 교체
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  replaced: true,
                  content: filterResult.filtered,
                  metadata: {
                    isCrisis,
                    isBlocked: true,
                    blockReason: filterResult.reason
                  }
                })}\n\n`
              )
            )
          } else {
            // 응답 품질 검증
            const qualityCheck = validateResponseQuality(fullResponse)
            const quality = checkResponseQuality(fullResponse)

            if (!qualityCheck.isValid) {
              logger.warn('⚠️ Response quality issues detected:', qualityCheck.issues)
            }

            // 감정 추적 (백그라운드 처리, 에러 시에도 응답 전송)
            if (userId) {
              // Immediately invoked async function with full error handling
              setImmediate(async () => {
                try {
                  const { detectEmotionFromMessage } = await import('@/lib/gemini/emotion-analyzer')
                  const { saveEmotionSnapshot } = await import('@/lib/firebase/emotion-tracking-admin')

                  const emotionAnalysis = detectEmotionFromMessage(latestUserMessage)

                  await saveEmotionSnapshot({
                    userId,
                    sessionId: 'temp-session-id',
                    timestamp: new Date(),
                    emotion: emotionAnalysis.emotion,
                    intensity: emotionAnalysis.intensity,
                    userMessage: latestUserMessage.substring(0, 200),
                    context: messages.slice(-2).map((m: Message) => m.content.substring(0, 100)).join(' '),
                    metadata: {
                      conversationLength: messages.length,
                      counselingMode,
                    }
                  })
                } catch (error) {
                  // Silently fail - emotion tracking is non-critical
                  logger.warn('Emotion tracking skipped:', error)
                }
              })
            }

            // 정상 응답 메타데이터 전송
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  metadata: {
                    isCrisis,
                    quality,
                    qualityIssues: qualityCheck.issues
                  }
                })}\n\n`
              )
            )
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    logger.error('[Chat API] Critical Error:', error)
    logger.error('[Chat API] Error stack:', error?.stack)
    logger.error('[Chat API] Error details:', {
      message: error?.message,
      name: error?.name,
      code: error?.code,
    })

    // API 키 오류 처리
    if (error?.status === 401 || error?.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'Gemini API 키가 유효하지 않습니다.',
          error_en: 'Invalid Gemini API key.',
          errorCode: 'INVALID_API_KEY'
        },
        { status: 401 }
      )
    }

    // Rate limit 오류 처리
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
          error_en: 'Too many requests. Please try again later.',
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 60
        },
        { status: 429 }
      )
    }

    // 타임아웃 오류 처리
    if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timeout')) {
      return NextResponse.json(
        {
          error: '응답 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.',
          error_en: 'Request timeout. Please check your network connection.',
          errorCode: 'TIMEOUT'
        },
        { status: 408 }
      )
    }

    // 네트워크 오류 처리
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      return NextResponse.json(
        {
          error: '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
          error_en: 'Network connection failed. Please check your internet connection.',
          errorCode: 'NETWORK_ERROR'
        },
        { status: 503 }
      )
    }

    // Gemini 서버 오류
    if (error?.status >= 500) {
      return NextResponse.json(
        {
          error: 'Gemini 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.',
          error_en: 'Gemini server is temporarily unavailable. Please try again later.',
          errorCode: 'GEMINI_SERVER_ERROR'
        },
        { status: 503 }
      )
    }

    // 일반 서버 오류
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다. 다시 시도해주세요.',
        error_en: 'Server error occurred. Please try again.',
        errorCode: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}
