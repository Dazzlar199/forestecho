/**
 * SEO 최적화된 네이버 블로그 포스트 생성
 * - 검색 친화적 제목
 * - 첫 문단 키워드 최적화
 * - 내부 링크 추가
 */

import { ARTICLES } from '../types/education'
import * as fs from 'fs'
import * as path from 'path'

// SEO 최적화된 제목 생성
function generateSEOTitle(article: typeof ARTICLES[0]): string {
  const originalTitle = article.title.ko

  // 아티클별 맞춤 SEO 제목
  const seoTitles: Record<string, string> = {
    'article-workplace-1': '번아웃 증후군 자가진단 | 예방과 회복 방법 완벽 가이드',
    'article-relationships-1': '건강한 의사소통 기술 7가지 | 관계를 강화하는 대화법',
    'article-lifestyle-2': '운동과 정신건강의 관계 | 우울증·불안에 효과적인 운동 5가지',
    'article-management-2': '마음챙김 명상하는 법 | 초보자를 위한 5분 명상 가이드',
    'article-lifestyle-3': '정신건강에 좋은 음식 10가지 | 뇌 건강 영양 가이드',
    'article-relationships-2': '건강한 경계 설정 방법 | "아니요" 말하는 기술',
    'article-workplace-2': '일과 삶의 균형 찾기 | 워라밸 실천 방법 10가지',
    'ocd-understanding': '강박장애(OCD) 자가진단 | 증상·원인·치료 총정리',
    'anger-management': '분노조절장애 자가진단 | 화 다스리는 방법 8가지',
    'article-conditions-4': '공황장애 증상 체크리스트 | 공황발작 대처법과 치료',
    'article-conditions-5': '사회불안장애 극복하기 | 대인공포증 증상과 치료법',
    'article-management-3': '감정조절 못하는 이유 | DBT 기법으로 감정 다스리기',
    'article-management-4': '상실과 슬픔 극복하기 | 애도 과정과 치유 방법',
    'article-basics-2': '정신과 상담 받는 법 | 비용·절차·병원 찾기 완벽 가이드',
    'article-lifestyle-4': '디지털 디톡스 방법 | 스마트폰 중독 예방 7가지 습관',
    'article-lifestyle-5': '자기돌봄 루틴 만들기 | 번아웃 예방 셀프케어 10가지',
    'article-adolescent-1': '청소년 우울증 자가진단 | 10대 자녀 우울증 징후와 대처법',
    'article-adolescent-2': '학업 스트레스 관리법 | 시험 불안 극복하는 5가지 방법',
    'article-adolescent-3': '학교폭력 대처법 | 왕따·사이버불링 피해 시 해야 할 일',
    'article-adolescent-4': '청소년 SNS 중독 예방 | 건강한 소셜미디어 사용법',
  }

  return seoTitles[article.id] || originalTitle
}

// SEO 최적화된 인트로 생성
function generateSEOIntro(article: typeof ARTICLES[0], seoTitle: string): string {
  const keywords = extractKeywords(seoTitle)

  return `안녕하세요! 오늘은 ${keywords[0]}에 대해 자세히 알아보겠습니다. ${keywords[0]}는 많은 분들이 궁금해하시는 주제인데요, 이 글에서는 ${keywords[1] || '관련 정보'}와 ${keywords[2] || '실천 방법'}까지 상세히 다뤄보겠습니다.`
}

// 제목에서 핵심 키워드 추출
function extractKeywords(title: string): string[] {
  // 특수문자 제거하고 주요 단어 추출
  const words = title
    .replace(/[|]/g, ' ')
    .split(' ')
    .filter(w => w.length > 2 && !['방법', '가지', '완벽', '가이드', '체크리스트'].includes(w))

  return words.slice(0, 3)
}

// 관련글 추천 생성
function generateRelatedArticles(article: typeof ARTICLES[0], allArticles: typeof ARTICLES): string[] {
  const related: string[] = []

  // 같은 카테고리 글
  const sameCategory = allArticles.filter(a =>
    a.category === article.category && a.id !== article.id
  ).slice(0, 2)

  related.push(...sameCategory.map(a => `→ ${generateSEOTitle(a)}`))

  // 다른 인기 글 추가
  if (related.length < 3) {
    const others = allArticles
      .filter(a => a.id !== article.id && !sameCategory.includes(a))
      .slice(0, 3 - related.length)

    related.push(...others.map(a => `→ ${generateSEOTitle(a)}`))
  }

  return related.slice(0, 3)
}

function generateSEOOptimizedPost(article: typeof ARTICLES[0], allArticles: typeof ARTICLES): string {
  const sections = article.content.ko
  const seoTitle = generateSEOTitle(article)
  const seoIntro = generateSEOIntro(article, seoTitle)
  const relatedArticles = generateRelatedArticles(article, allArticles)

  // 메인 섹션만 목차에 포함 (헤딩이 "1.", "2." 등으로 시작하지 않는 것들만)
  const mainSections = sections.filter(section => {
    const heading = section.heading || ''
    return !heading.match(/^\d+\./)
  })

  let text = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${seoTitle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 ${article.summary.ko}

⏰ 읽는 시간: ${article.readTime}분
📂 카테고리: ${article.category}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ${seoIntro}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 목차
${mainSections.map((section, index) => `${index + 1}. ${section.heading || '내용'}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${sections.map((section, sectionIndex) => {
  const heading = section.heading || '내용'
  const isSubSection = heading.match(/^\d+\./)

  // 하위 섹션인 경우 구분선 없이 표시
  if (isSubSection) {
    return `
**${heading}**

${section.paragraphs ? section.paragraphs.join('\n\n') : ''}
${section.list ? '\n' + section.list.items.map((item, idx) =>
  section.list!.type === 'numbered'
    ? `${idx + 1}. ${item}`
    : `• ${item}`
).join('\n') : ''}`
  }

  // 메인 섹션인 경우 구분선과 함께 표시
  const mainIndex = mainSections.findIndex(s => s.heading === heading) + 1
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${mainIndex}. ${heading}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${section.paragraphs ? section.paragraphs.join('\n\n') : ''}
${section.list ? '\n' + section.list.items.map((item, idx) =>
  section.list!.type === 'numbered'
    ? `${idx + 1}. ${item}`
    : `• ${item}`
).join('\n') : ''}`
}).join('\n')}

${article.recommendedProducts && article.recommendedProducts.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 함께 읽으면 좋은 추천 도서
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${article.recommendedProducts.map((product, idx) => `
${idx + 1}. ${product.title.ko}

${product.description.ko}

💰 가격: ₩${product.price.toLocaleString()}
🛒 구매하기: ${product.link}

📸 이미지 URL (네이버 블로그 "사진" 버튼으로 추가):
${product.imageUrl}

───────────────────────────────────────────────────────────────
`).join('\n')}

※ 파트너스 활동으로 일정 수수료를 제공받을 수 있습니다

` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 참고 자료
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${article.sources.map(source => `• ${source.name} - ${source.organization}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 함께 읽으면 좋은 글
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${relatedArticles.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌲 숲울림에서 AI 상담 받아보세요

24시간 언제든지, 전문적인 AI 심리상담이 준비되어 있습니다.

👉 지금 상담하기: https://forestecho.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

  return text
}

async function main() {
  const outputDir = path.join(process.cwd(), 'blog-posts')
  const seoDir = path.join(outputDir, 'seo-optimized')

  if (!fs.existsSync(seoDir)) {
    fs.mkdirSync(seoDir, { recursive: true })
  }

  console.log('🚀 SEO 최적화 블로그 포스트 생성 중...\n')

  // 7번부터 26번까지 (인덱스 6~25)
  const articlesToOptimize = ARTICLES.slice(6, 26)

  articlesToOptimize.forEach((article, idx) => {
    const actualIndex = idx + 7 // 7번부터 시작
    const text = generateSEOOptimizedPost(article, ARTICLES)
    const txtPath = path.join(seoDir, `${actualIndex}_${article.id}_SEO.txt`)
    fs.writeFileSync(txtPath, text, 'utf-8')

    const seoTitle = generateSEOTitle(article)
    console.log(`✅ ${actualIndex}. ${seoTitle}`)
  })

  console.log(`\n🎉 총 ${articlesToOptimize.length}개의 SEO 최적화 포스트가 생성되었습니다!`)
  console.log(`📂 저장 위치: ${seoDir}`)

  console.log(`\n💡 개선사항:`)
  console.log(`✅ 검색 친화적 제목 (키워드 최적화)`)
  console.log(`✅ 첫 문단에 SEO 인트로 추가 (키워드 반복)`)
  console.log(`✅ 관련글 내부 링크 3개 추가`)
  console.log(`✅ 기존 콘텐츠 유지 + SEO 요소 강화`)

  console.log(`\n📋 네이버 블로그 포스팅 방법:`)
  console.log(`1. seo-optimized 폴더의 txt 파일 열기`)
  console.log(`2. 전체 복사 (Cmd/Ctrl + A → Cmd/Ctrl + C)`)
  console.log(`3. 네이버 블로그에 붙여넣기`)
  console.log(`4. 제목이 자동으로 SEO 최적화된 제목으로 설정됨!`)
}

main().catch(console.error)
