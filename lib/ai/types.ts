/**
 * AI Provider 추상화 타입 정의
 */

export type AIProvider = 'openai' | 'gemini'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIStreamOptions {
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: Error) => void
}

export interface AICompletionOptions {
  messages: AIMessage[]
  temperature?: number
  maxTokens?: number
}

export interface AIProviderConfig {
  model: string
  temperature: number
  maxTokens: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

/**
 * AI Provider 인터페이스
 * OpenAI와 Gemini 모두 이 인터페이스를 구현
 */
export interface IAIProvider {
  provider: AIProvider
  streamCompletion(options: AIStreamOptions): Promise<void>
  getCompletion(options: AICompletionOptions): Promise<string>
  getConfig(): AIProviderConfig
}
