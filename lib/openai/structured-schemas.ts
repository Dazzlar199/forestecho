// OpenAI Structured Outputs를 위한 스키마 정의
import { z } from 'zod'

// 감정 분석 스키마
export const EmotionSchema = z.object({
  name: z.string().describe('감정 이름 (예: 불안, 우울, 분노, 기쁨)'),
  intensity: z.number().min(0).max(10).describe('감정 강도 (0-10)'),
  trigger: z.string().optional().describe('감정을 촉발한 상황이나 생각'),
})

// 인지 왜곡 스키마
export const CognitiveDistortionSchema = z.object({
  type: z.enum([
    '흑백논리',
    '과잉일반화',
    '정신적필터',
    '긍정무시',
    '성급한결론',
    '확대와축소',
    '감정적추론',
    '당위적사고',
    '낙인찍기',
    '개인화'
  ]).describe('인지 왜곡 유형'),
  example: z.string().describe('내담자 메시지에서 발견된 구체적 예시'),
  challenge: z.string().describe('이 왜곡에 도전하는 질문이나 대안적 관점'),
})

// 제안 기법 스키마
export const TechniqueSchema = z.object({
  name: z.string().describe('심리 기법 이름'),
  category: z.enum(['호흡', '마음챙김', '인지재구조화', '행동활성화', '이완', '기타']),
  description: z.string().describe('기법에 대한 간단한 설명'),
  steps: z.array(z.string()).describe('실행 단계 (최대 5단계)'),
  expectedBenefit: z.string().describe('기대 효과'),
})

// 핵심 통찰 스키마
export const InsightSchema = z.object({
  pattern: z.string().describe('발견된 패턴 (예: 반복되는 상황, 회피 행동 등)'),
  underlyingNeed: z.string().optional().describe('표면 문제 이면의 진짜 욕구'),
  connectionToPast: z.string().optional().describe('과거 경험과의 연결고리'),
})

// 전체 상담 응답 스키마
export const CounselingResponseSchema = z.object({
  message: z.string().describe('내담자에게 전달할 공감적이고 전문적인 메시지'),

  analysis: z.object({
    emotions: z.array(EmotionSchema).describe('감지된 감정들'),
    cognitiveDistortions: z.array(CognitiveDistortionSchema).optional().describe('발견된 인지 왜곡들'),
    coreIssue: z.string().optional().describe('핵심 문제 요약'),
    insights: z.array(InsightSchema).optional().describe('치료적 통찰'),
  }).describe('심리 분석 결과'),

  suggestions: z.object({
    immediate: z.array(TechniqueSchema).optional().describe('즉시 시도할 수 있는 기법 (1-2개)'),
    questions: z.array(z.string()).optional().describe('내담자 탐색을 위한 후속 질문 (1-2개)'),
    resources: z.array(z.string()).optional().describe('추천 리소스나 추가 정보'),
  }).optional().describe('제안사항'),

  riskAssessment: z.object({
    level: z.enum(['low', 'medium', 'high']).describe('위험 수준'),
    concerns: z.array(z.string()).optional().describe('구체적 우려사항'),
    recommendProfessionalHelp: z.boolean().describe('전문가 도움 필요 여부'),
  }).describe('위험 평가'),
})

// TypeScript 타입 추출
export type Emotion = z.infer<typeof EmotionSchema>
export type CognitiveDistortion = z.infer<typeof CognitiveDistortionSchema>
export type Technique = z.infer<typeof TechniqueSchema>
export type Insight = z.infer<typeof InsightSchema>
export type CounselingResponse = z.infer<typeof CounselingResponseSchema>

// JSON Schema로 변환 (OpenAI API용) - Simplified for compatibility
export function getCounselingResponseJsonSchema() {
  return {
    name: "counseling_response",
    strict: true,
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "내담자에게 전달할 공감적이고 전문적인 메시지"
        },
        analysis: {
          type: "object",
          properties: {
            emotions: {
              type: "array",
              description: "감지된 감정 목록",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "감정 이름"
                  },
                  intensity: {
                    type: "number",
                    description: "감정 강도 0-10"
                  }
                },
                required: ["name", "intensity"],
                additionalProperties: false
              }
            },
            coreIssue: {
              type: "string",
              description: "핵심 문제 요약"
            }
          },
          required: ["emotions", "coreIssue"],
          additionalProperties: false
        },
        riskAssessment: {
          type: "object",
          properties: {
            level: {
              type: "string",
              enum: ["low", "medium", "high"],
              description: "위험 수준"
            },
            recommendProfessionalHelp: {
              type: "boolean",
              description: "전문가 도움 권장 여부"
            }
          },
          required: ["level", "recommendProfessionalHelp"],
          additionalProperties: false
        }
      },
      required: ["message", "analysis", "riskAssessment"],
      additionalProperties: false
    }
  }
}
