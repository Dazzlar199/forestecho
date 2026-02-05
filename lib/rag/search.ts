import { logger } from '@/lib/utils/logger'
/**
 * RAG Search Functions
 */

import { getPineconeClient, PINECONE_INDEX_NAME, type Namespace } from './pinecone-config'
import { generateEmbedding } from './embeddings'

export interface SearchResult {
  id: string
  title: string
  content: string
  score: number
  namespace: string
  metadata?: Record<string, any>
}

/**
 * Search knowledge base with semantic similarity
 */
export async function searchKnowledge(
  query: string,
  options: {
    topK?: number
    minScore?: number
    namespace?: Namespace
  } = {}
): Promise<SearchResult[]> {
  try {
    const { topK = 3, minScore = 0.7, namespace } = options

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query)

    // Get Pinecone client
    const pinecone = getPineconeClient()
    const index = pinecone.index(PINECONE_INDEX_NAME)

    // Search with optional namespace filter
    const queryRequest: any = {
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    }

    if (namespace) {
      queryRequest.namespace = namespace
    }

    const searchResults = await index.query(queryRequest)

    // Filter by score and format results
    const results: SearchResult[] = []

    for (const match of searchResults.matches || []) {
      if (match.score && match.score >= minScore) {
        results.push({
          id: match.id,
          title: (match.metadata?.title as string) || '',
          content: (match.metadata?.content as string) || '',
          score: match.score,
          namespace: (match.metadata?.namespace as string) || '',
          metadata: match.metadata as Record<string, any>,
        })
      }
    }

    return results
  } catch (error: any) {
    logger.error('RAG search failed:', error)
    return [] // Return empty array on error (graceful degradation)
  }
}

/**
 * Format search results for LLM context
 */
export function formatSearchResults(results: SearchResult[]): string {
  if (results.length === 0) {
    return ''
  }

  let formatted = '## 관련 심리학 지식:\n\n'

  for (const result of results) {
    formatted += `### ${result.title}\n`
    formatted += `${result.content}\n\n`
    formatted += `[관련도: ${(result.score * 100).toFixed(1)}%]\n\n`
    formatted += '---\n\n'
  }

  return formatted
}

/**
 * Intelligent search based on conversation context
 */
export async function searchRelevantKnowledge(
  userMessage: string,
  conversationHistory: string[]
): Promise<string> {
  try {
    // Extract key themes from recent conversation
    const recentContext = conversationHistory.slice(-3).join(' ')
    const searchQuery = `${userMessage} ${recentContext}`

    // Search across all namespaces
    const results = await searchKnowledge(searchQuery, {
      topK: 2,
      minScore: 0.75,
    })

    return formatSearchResults(results)
  } catch (error) {
    logger.error('Intelligent search failed:', error)
    return ''
  }
}
