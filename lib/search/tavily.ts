import { tavily } from '@tavily/core'
import { logger } from '@/lib/utils/logger'

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY || '',
})

export async function searchPsychologyKnowledge(query: string): Promise<string> {
  try {
    if (!process.env.TAVILY_API_KEY) {
      logger.warn('Tavily API key not configured')
      return ''
    }

    // 3초 타임아웃 설정
    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        logger.warn('Tavily search timeout')
        resolve('')
      }, 3000)
    })

    const searchPromise = tavilyClient.search(query, {
      searchDepth: 'advanced',
      maxResults: 3,
      includeAnswer: true,
      includeRawContent: false,
    }).then((response) => {
      if (response.answer) {
        return response.answer
      }

      // Fallback to concatenating top results
      const knowledge = response.results
        .slice(0, 2)
        .map((result) => result.content)
        .join('\n\n')

      return knowledge
    })

    const result = await Promise.race([searchPromise, timeoutPromise])
    return result
  } catch (error) {
    logger.error('Tavily search error:', error)
    return ''
  }
}

export async function enhanceWithResearch(userMessage: string, context: string): Promise<string> {
  // 메시지가 너무 짧으면 검색 건너뛰기
  if (userMessage.length < 5) {
    return ''
  }

  // 심리학 이론이나 연구가 필요한 키워드 감지
  const researchKeywords = [
    '우울', '불안', '트라우마', '스트레스', '공황', '강박',
    '중독', '자존감', '대인관계', '가족', '직장', '학업',
    '수면', '분노', '애도', '상실', '외상', '자살',
  ]

  const needsResearch = researchKeywords.some((keyword) =>
    userMessage.includes(keyword) || context.includes(keyword)
  )

  if (!needsResearch) {
    return ''
  }

  // 관련 심리학 지식 검색
  const searchQuery = `심리학 이론 연구 ${userMessage.substring(0, 100)}`
  const knowledge = await searchPsychologyKnowledge(searchQuery)

  return knowledge
}
