/**
 * AI Provider Factory
 * 사용자의 구독 상태에 따라 적절한 AI Provider를 반환
 */

import type { IAIProvider, AIProvider as AIProviderType } from './types'
import { OpenAIProvider } from './openai-provider'
import { GeminiProvider } from './gemini-provider'

/**
 * AI Provider 선택 로직
 * - Premium 사용자: OpenAI (GPT-4o-mini)
 * - Free 사용자: Gemini (gemini-3-flash-preview)
 */
export function getAIProvider(isPremium: boolean): IAIProvider {
  if (isPremium) {
    return new OpenAIProvider()
  } else {
    return new GeminiProvider()
  }
}

/**
 * 특정 Provider를 직접 지정하여 가져오기
 */
export function getSpecificProvider(provider: AIProviderType): IAIProvider {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider()
    case 'gemini':
      return new GeminiProvider()
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

/**
 * Backward compatibility를 위한 legacy exports
 */
export { OpenAIProvider, GeminiProvider }
export type { IAIProvider }
