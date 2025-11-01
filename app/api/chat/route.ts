import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai/config'
import { ADVANCED_COUNSELOR_PROMPT } from '@/lib/openai/advanced-prompts'
import {
  detectCrisisKeywords,
  generateContextualSystemMessage,
  checkResponseQuality,
  type Message,
} from '@/lib/openai/context-manager'
import { enhanceWithResearch } from '@/lib/search/tavily'
import { COUNSELING_MODES, type CounselingMode } from '@/lib/openai/counseling-modes'
import { rateLimit } from '@/lib/rate-limit'

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
  try {
    // Rate limiting: 10 requests per minute per IP
    const identifier = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
    const rateLimitResult = rateLimit(identifier, { limit: 10, window: 60 })

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

    const { messages, language = 'ko', counselingMode = 'general', responseTone = 50 } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      )
    }

    // 위기 상황 감지
    const latestUserMessage = messages.filter((m: Message) => m.role === 'user').slice(-1)[0]?.content || ''
    const isCrisis = detectCrisisKeywords(latestUserMessage)

    // 맥락 기반 시스템 메시지
    const contextualGuidance = generateContextualSystemMessage(messages, {
      riskLevel: isCrisis ? 'high' : 'low',
    })

    // 심리학 연구 및 이론 검색 (Tavily API)
    const conversationContext = messages.slice(-3).map((m: Message) => m.content).join(' ')
    const researchKnowledge = await enhanceWithResearch(latestUserMessage, conversationContext)

    // 선택한 상담 모드의 프롬프트 사용
    const modePrompt = COUNSELING_MODES[counselingMode as CounselingMode]?.prompt || ADVANCED_COUNSELOR_PROMPT

    // 시스템 프롬프트 구성
    let systemPrompt = modePrompt + '\n\n' + contextualGuidance

    // 언어 설정 추가
    systemPrompt += `\n\n**IMPORTANT LANGUAGE INSTRUCTION**: ${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.ko}`

    // 이성-감정 톤 조정 (0: 이성적, 100: 감성적)
    const toneGuidance = getToneGuidance(responseTone)
    systemPrompt += `\n\n**답변 스타일 가이드**: ${toneGuidance}`

    if (isCrisis) {
      systemPrompt += `\n\n⚠️ 위기 상황 감지됨. 안전 최우선 프로토콜 적용.`
    }

    // 검색된 심리학 지식 추가
    if (researchKnowledge && researchKnowledge.length > 50) {
      systemPrompt += `\n\n## 관련 심리학 연구 및 이론:\n${researchKnowledge}\n\n위 연구 결과를 참고하여 증거 기반의 조언을 제공하세요. 적절한 경우 "연구에 따르면..." 등으로 인용하세요.`
    }

    // OpenAI API 호출 - 스트리밍 응답 (gpt-4o-mini)
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.7,
      frequency_penalty: 0.4,
      top_p: 0.95,
      stream: true,
    })

    // 스트리밍 응답을 위한 ReadableStream 생성
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        let fullResponse = ''

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullResponse += content
              // 클라이언트로 청크 전송
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }

          // 스트림 종료 시 메타데이터 전송
          const quality = checkResponseQuality(fullResponse)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                metadata: { isCrisis, quality }
              })}\n\n`
            )
          )
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
    console.error('OpenAI API Error:', error)

    // API 키 오류 처리
    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: 'OpenAI API 키가 유효하지 않습니다.',
          error_en: 'Invalid OpenAI API key.',
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

    // JSON 파싱 오류 (Structured Output)
    if (error?.message?.includes('JSON') || error?.message?.includes('parse')) {
      return NextResponse.json(
        {
          error: '응답 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
          error_en: 'Response processing error. Please try again.',
          errorCode: 'PARSE_ERROR'
        },
        { status: 500 }
      )
    }

    // 기타 OpenAI API 오류
    if (error?.status >= 500) {
      return NextResponse.json(
        {
          error: 'OpenAI 서버에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.',
          error_en: 'OpenAI server is temporarily unavailable. Please try again later.',
          errorCode: 'OPENAI_SERVER_ERROR'
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
