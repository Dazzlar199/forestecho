import { logger } from '@/lib/utils/logger'
/**
 * OpenAI Embeddings for RAG
 */

import { openai } from '@/lib/openai/config'

/**
 * Generate embedding for text using OpenAI text-embedding-3-small
 * Cost: $0.02 per 1M tokens
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.trim(),
      encoding_format: 'float',
    })

    return response.data[0].embedding
  } catch (error: any) {
    logger.error('Failed to generate embedding:', error)
    throw new Error(`Embedding generation failed: ${error.message}`)
  }
}

/**
 * Generate embeddings in batch (more efficient for multiple texts)
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts.map(t => t.trim()),
      encoding_format: 'float',
    })

    return response.data.map(item => item.embedding)
  } catch (error: any) {
    logger.error('Failed to generate batch embeddings:', error)
    throw new Error(`Batch embedding generation failed: ${error.message}`)
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}
