/**
 * Pinecone Vector Database Configuration
 *
 * Free tier: 1 index, 100K vectors, 2GB storage
 */

import { Pinecone } from '@pinecone-database/pinecone'

let pineconeInstance: Pinecone | null = null

/**
 * Get Pinecone client (singleton)
 */
export function getPineconeClient(): Pinecone {
  if (!pineconeInstance) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables')
    }

    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }

  return pineconeInstance
}

/**
 * Index configuration
 */
export const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'psychology-kb'
export const EMBEDDING_DIMENSION = 1536 // text-embedding-3-small dimension

/**
 * Namespace configuration for organizing vectors
 */
export const NAMESPACES = {
  CBT_TECHNIQUES: 'cbt-techniques',
  DBT_TECHNIQUES: 'dbt-techniques',
  PSYCHOLOGY_THEORY: 'psychology-theory',
  MENTAL_HEALTH_INFO: 'mental-health-info',
  CRISIS_PROTOCOLS: 'crisis-protocols',
} as const

export type Namespace = typeof NAMESPACES[keyof typeof NAMESPACES]
