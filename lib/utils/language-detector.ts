/**
 * 텍스트 언어 자동 감지
 * 한국어, 영어, 일본어, 중국어 감지
 */

export type DetectedLanguage = 'ko' | 'en' | 'ja' | 'zh'

/**
 * 텍스트에서 언어를 감지합니다
 * @param text 분석할 텍스트
 * @returns 감지된 언어 코드
 */
export function detectLanguage(text: string): DetectedLanguage {
  if (!text || text.trim().length === 0) {
    return 'ko' // 기본값
  }

  const trimmedText = text.trim()

  // 한글 감지 (가-힣)
  const koreanChars = trimmedText.match(/[가-힣]/g)
  const koreanRatio = koreanChars ? koreanChars.length / trimmedText.length : 0

  // 일본어 감지 (히라가나, 가타카나, 한자)
  const japaneseChars = trimmedText.match(/[\u3040-\u309F\u30A0-\u30FF]/g)
  const japaneseRatio = japaneseChars ? japaneseChars.length / trimmedText.length : 0

  // 중국어 간체/번체 감지 (CJK 통합 한자)
  const chineseChars = trimmedText.match(/[\u4E00-\u9FFF]/g)
  const chineseRatio = chineseChars ? chineseChars.length / trimmedText.length : 0

  // 영어 감지 (알파벳)
  const englishChars = trimmedText.match(/[a-zA-Z]/g)
  const englishRatio = englishChars ? englishChars.length / trimmedText.length : 0

  // 임계값: 20% 이상이면 해당 언어로 판단
  const threshold = 0.2

  // 우선순위: 한국어 > 일본어 > 중국어 > 영어
  if (koreanRatio >= threshold) {
    return 'ko'
  }

  if (japaneseRatio >= threshold) {
    return 'ja'
  }

  // 중국어와 일본어는 한자를 공유하므로 추가 체크
  if (chineseRatio >= threshold) {
    // 일본어 특유의 문자가 없고 한자만 있으면 중국어
    if (japaneseRatio < 0.05) {
      return 'zh'
    }
  }

  if (englishRatio >= threshold) {
    return 'en'
  }

  // 기본값: 영어 비율이 가장 높으면 영어, 아니면 한국어
  if (englishRatio > 0.1) {
    return 'en'
  }

  return 'ko'
}

/**
 * 여러 메시지에서 언어를 감지합니다 (최근 메시지 우선)
 * @param messages 메시지 배열
 * @param limit 분석할 최대 메시지 수
 * @returns 감지된 언어 코드
 */
export function detectLanguageFromMessages(
  messages: Array<{ role: string; content: string }>,
  limit: number = 3
): DetectedLanguage {
  // 사용자 메시지만 필터링 (역순으로 최근 것부터)
  const userMessages = messages
    .filter((m) => m.role === 'user')
    .slice(-limit)
    .reverse()

  if (userMessages.length === 0) {
    return 'ko' // 기본값
  }

  // 최근 메시지부터 언어 감지 시도
  for (const message of userMessages) {
    const detected = detectLanguage(message.content)
    // 한국어가 아닌 경우 즉시 반환 (명확한 의도)
    if (detected !== 'ko') {
      return detected
    }
  }

  // 모든 메시지가 한국어인 경우
  return 'ko'
}
