/**
 * OpenAI Provider Implementation
 */

import OpenAI from 'openai'
import type { IAIProvider, AIStreamOptions, AICompletionOptions, AIProviderConfig } from './types'

export class OpenAIProvider implements IAIProvider {
  public readonly provider = 'openai' as const
  private client: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined')
    }
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  getConfig(): AIProviderConfig {
    return {
      model: 'gpt-4o-mini',
      temperature: 0.9,
      maxTokens: 2000,
      topP: 0.95,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
    }
  }

  async streamCompletion(options: AIStreamOptions): Promise<void> {
    const config = this.getConfig()
    const stream = await this.client.chat.completions.create({
      model: config.model,
      messages: options.messages as any,
      temperature: options.temperature ?? config.temperature,
      max_tokens: options.maxTokens ?? config.maxTokens,
      top_p: config.topP,
      frequency_penalty: config.frequencyPenalty,
      presence_penalty: config.presencePenalty,
      stream: true,
    })

    let fullResponse = ''
    try {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) {
          fullResponse += content
          options.onToken?.(content)
        }
      }
      options.onComplete?.(fullResponse)
    } catch (error) {
      options.onError?.(error as Error)
      throw error
    }
  }

  async getCompletion(options: AICompletionOptions): Promise<string> {
    const config = this.getConfig()
    const response = await this.client.chat.completions.create({
      model: config.model,
      messages: options.messages as any,
      temperature: options.temperature ?? config.temperature,
      max_tokens: options.maxTokens ?? config.maxTokens,
      top_p: config.topP,
      frequency_penalty: config.frequencyPenalty,
      presence_penalty: config.presencePenalty,
    })

    return response.choices[0]?.message?.content || ''
  }
}
