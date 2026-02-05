import { z } from 'zod'

/**
 * 채팅 API 요청 스키마
 */
export const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().min(1, '메시지는 최소 1자 이상이어야 합니다.').max(5000, '메시지는 최대 5000자까지 가능합니다.'),
    })
  ).min(1, '최소 1개의 메시지가 필요합니다.').max(100, '메시지는 최대 100개까지 가능합니다.'),
  language: z.enum(['ko', 'en', 'ja', 'zh']).optional(),
  counselingMode: z.enum(['general', 'cbt', 'dbt', 'act', 'solution-focused', 'psychodynamic', 'humanistic']).optional(),
  responseTone: z.number().min(0).max(100).optional(),
  userId: z.string().optional(),
})

export type ChatRequest = z.infer<typeof ChatRequestSchema>

/**
 * 감정 체크인 API 요청 스키마
 */
export const EmotionCheckinSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다.'),
  emotion: z.enum(['happy', 'sad', 'anxious', 'angry', 'calm', 'stressed', 'excited', 'tired']),
  intensity: z.number().min(1).max(10),
  note: z.string().max(500, '노트는 최대 500자까지 가능합니다.').optional(),
  timestamp: z.number().optional(),
})

export type EmotionCheckin = z.infer<typeof EmotionCheckinSchema>

/**
 * 심리 분석 요청 스키마
 */
export const AnalysisRequestSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다.'),
  sessionId: z.string().min(1, '세션 ID가 필요합니다.'),
  analysisType: z.enum(['quick', 'comprehensive', 'crisis']).optional(),
})

export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>

/**
 * 커뮤니티 포스트 생성 스키마
 */
export const CreatePostSchema = z.object({
  userId: z.string().min(1, '사용자 ID가 필요합니다.'),
  title: z.string().min(1, '제목은 필수입니다.').max(200, '제목은 최대 200자까지 가능합니다.'),
  content: z.string().min(10, '내용은 최소 10자 이상이어야 합니다.').max(5000, '내용은 최대 5000자까지 가능합니다.'),
  tags: z.array(z.string()).max(10, '태그는 최대 10개까지 가능합니다.').optional(),
  isAnonymous: z.boolean().optional(),
})

export type CreatePost = z.infer<typeof CreatePostSchema>

/**
 * 공통 에러 응답 타입
 */
export interface ValidationError {
  field: string
  message: string
}

/**
 * Zod 에러를 포맷팅하는 헬퍼 함수
 */
export function formatZodErrors(error: z.ZodError): ValidationError[] {
  return error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
}
