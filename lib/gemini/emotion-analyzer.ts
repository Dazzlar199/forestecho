/**
 * Emotion Analysis from Conversation
 */

import type { EmotionType } from '@/types/emotion'

/**
 * Simple rule-based emotion detection from user message
 * (For production, consider using sentiment analysis API)
 */
export function detectEmotionFromMessage(message: string): {
  emotion: EmotionType
  intensity: number
} {
  const lowerMessage = message.toLowerCase()

  // Keyword-based detection (Korean)
  const emotionKeywords: Record<EmotionType, string[]> = {
    very_happy: ['너무 기쁘', '정말 행복', '최고', '완전 좋', '너무 좋'],
    happy: ['기쁘', '행복', '좋아', '즐거', '만족'],
    calm: ['평온', '차분', '안정', '편안', '괜찮'],
    neutral: ['그냥', '보통', '별로', '그저 그래'],
    anxious: ['불안', '걱정', '초조', '긴장', '떨려'],
    sad: ['슬프', '우울', '힘들', '외로', '쓸쓸'],
    angry: ['화나', '짜증', '열받', '분노', '억울'],
    stressed: ['스트레스', '지쳐', '피곤', '힘겨', '버거'],
  }

  // Count matches
  let bestMatch: EmotionType = 'neutral'
  let maxMatches = 0

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length
    if (matches > maxMatches) {
      maxMatches = matches
      bestMatch = emotion as EmotionType
    }
  }

  // Calculate intensity based on intensity words
  let intensity = 5 // default
  if (lowerMessage.includes('너무') || lowerMessage.includes('정말') || lowerMessage.includes('완전')) {
    intensity = 8
  } else if (lowerMessage.includes('조금') || lowerMessage.includes('약간')) {
    intensity = 3
  } else if (maxMatches > 0) {
    intensity = 6
  }

  // Check for multiple exclamation marks
  const exclamationCount = (message.match(/!/g) || []).length
  intensity = Math.min(10, intensity + exclamationCount)

  return {
    emotion: bestMatch,
    intensity: Math.max(1, Math.min(10, intensity)),
  }
}

/**
 * Analyze conversation context for emotion patterns
 */
export function analyzeConversationEmotion(
  messages: string[]
): {
  overallEmotion: EmotionType
  intensity: number
  confidence: number
} {
  if (messages.length === 0) {
    return { overallEmotion: 'neutral', intensity: 5, confidence: 0 }
  }

  // Analyze last 3 messages for context
  const recentMessages = messages.slice(-3)
  const emotions = recentMessages.map(msg => detectEmotionFromMessage(msg))

  // Calculate average emotion (most common)
  const emotionCounts: Partial<Record<EmotionType, number>> = {}
  let totalIntensity = 0

  for (const { emotion, intensity } of emotions) {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    totalIntensity += intensity
  }

  const overallEmotion = Object.entries(emotionCounts).reduce((a, b) =>
    (a[1] || 0) > (b[1] || 0) ? a : b
  )[0] as EmotionType

  return {
    overallEmotion,
    intensity: Math.round(totalIntensity / emotions.length),
    confidence: Math.max(...Object.values(emotionCounts)) / emotions.length,
  }
}
