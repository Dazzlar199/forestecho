/**
 * Gemini Provider Implementation
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { IAIProvider, AIStreamOptions, AICompletionOptions, AIProviderConfig, AIMessage } from './types'

export class GeminiProvider implements IAIProvider {
  public readonly provider = 'gemini' as const
  private genAI: GoogleGenerativeAI

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || 'dummy-key-for-build'
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  getConfig(): AIProviderConfig {
    return {
      model: 'gemini-3-flash-preview',
      temperature: 1.0,
      maxTokens: 8192,
      topP: 0.95,
    }
  }

  private formatMessagesForGemini(messages: AIMessage[]) {
    // Gemini 형식: system은 별도, user/assistant는 history
    const systemMessage = messages.find(m => m.role === 'system')
    const chatMessages = messages.filter(m => m.role !== 'system')

    const history = chatMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const lastMessage = chatMessages[chatMessages.length - 1]?.content || ''

    return {
      systemInstruction: systemMessage?.content,
      history,
      userMessage: lastMessage,
    }
  }

  async streamCompletion(options: AIStreamOptions): Promise<void> {
    const config = this.getConfig()
    const { systemInstruction, history, userMessage } = this.formatMessagesForGemini(options.messages)

    const model = this.genAI.getGenerativeModel({
      model: config.model,
      systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? config.temperature,
        topP: config.topP,
        topK: 40,
        maxOutputTokens: options.maxTokens ?? config.maxTokens,
      },
    })

    const chat = model.startChat({ history })

    try {
      const result = await chat.sendMessageStream(userMessage)
      let fullResponse = ''

      for await (const chunk of result.stream) {
        const content = chunk.text()
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
    const { systemInstruction, history, userMessage } = this.formatMessagesForGemini(options.messages)

    const model = this.genAI.getGenerativeModel({
      model: config.model,
      systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? config.temperature,
        topP: config.topP,
        topK: 40,
        maxOutputTokens: options.maxTokens ?? config.maxTokens,
      },
    })

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(userMessage)
    return result.response.text()
  }
}
