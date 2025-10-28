import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai/config'
import { PREMIUM_ANALYSIS_PROMPT } from '@/lib/openai/prompts'
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { PsychologicalAnalysis } from '@/types/analysis'

export async function POST(request: NextRequest) {
  try {
    const { messages, userId, sessionId } = await request.json()

    // TODO: Firebase에서 사용자의 프리미엄 상태 확인
    // 임시로 모든 요청 허용

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '유효하지 않은 요청입니다.' },
        { status: 400 }
      )
    }

    // 대화 내용을 기반으로 심화 분석 생성
    const conversationSummary = messages
      .map((m: any) => `${m.role === 'user' ? '내담자' : '상담사'}: ${m.content}`)
      .join('\n\n')

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: PREMIUM_ANALYSIS_PROMPT,
        },
        {
          role: 'user',
          content: `다음은 지금까지의 상담 대화입니다:\n\n${conversationSummary}\n\n위 대화를 바탕으로 매우 정밀하고 깊이 있는 전문 심리 분석을 JSON 형식으로 제공해주세요.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
      max_tokens: 4096,
    })

    const analysisContent = completion.choices[0]?.message?.content

    if (!analysisContent) {
      throw new Error('분석 생성에 실패했습니다.')
    }

    // JSON 파싱
    let analysisData: Partial<PsychologicalAnalysis>
    try {
      analysisData = JSON.parse(analysisContent)
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      throw new Error('분석 결과 파싱에 실패했습니다.')
    }

    // Firestore에 분석 결과 저장
    const analysisDoc = await addDoc(collection(db, 'psychologicalAnalyses'), {
      ...analysisData,
      sessionId: sessionId || null,
      userId: userId || null,
      generatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    })

    const fullAnalysis: PsychologicalAnalysis = {
      id: analysisDoc.id,
      sessionId: sessionId || '',
      userId: userId || '',
      generatedAt: new Date().toISOString(),
      ...analysisData,
    } as PsychologicalAnalysis

    return NextResponse.json({
      analysis: fullAnalysis,
      analysisId: analysisDoc.id,
    })
  } catch (error: any) {
    console.error('Analysis API Error:', error)

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
