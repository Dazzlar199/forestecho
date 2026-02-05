/**
 * OpenAI API Configuration
 * @deprecated Use lib/ai/provider-factory.ts instead
 *
 * This file is kept for backward compatibility only.
 * New code should use the unified AI provider system.
 */

import OpenAI from 'openai'
import { OpenAIProvider } from '@/lib/ai'

let openaiInstance: OpenAI | null = null

/**
 * @deprecated Use OpenAIProvider from lib/ai instead
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not defined in environment variables')
    }
    openaiInstance = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiInstance
}

// Legacy export with lazy initialization
export const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    return getOpenAIClient()[prop as keyof OpenAI]
  }
})

export const OPENAI_MODEL = 'gpt-4o-mini'

export const OPENAI_CONFIG = {
  model: OPENAI_MODEL,
  temperature: 0.9,
  max_tokens: 2000,
  top_p: 0.95,
  frequency_penalty: 0.3,
  presence_penalty: 0.3,
}
