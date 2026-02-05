/**
 * Gemini API Configuration
 * @deprecated Use lib/ai/provider-factory.ts instead
 *
 * This file is kept for backward compatibility only.
 * New code should use the unified AI provider system.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiProvider } from '@/lib/ai'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || 'dummy-key-for-build'
);

/**
 * @deprecated Use GeminiProvider from lib/ai instead
 */
export const getGeminiModel = (modelName: string = 'gemini-3-flash-preview') => {
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 1.0, // Gemini 3 권장 기본값
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192, // Gemini 3 Flash 최대 출력
    },
  });
};

export default genAI;
