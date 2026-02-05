// 교육 콘텐츠 타입 정의
// 데이터는 public/data/articles.json에 저장됨

export type ArticleCategory =
  | 'basics' // 기본 개념
  | 'conditions' // 정신건강 질환
  | 'management' // 관리 및 대처
  | 'lifestyle' // 생활습관
  | 'relationships' // 대인관계
  | 'workplace' // 직장/학업
  | 'adolescent' // 청소년 정신건강

export interface Article {
  id: string
  category: ArticleCategory
  title: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  summary: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  content: {
    ko: ArticleSection[]
    en: ArticleSection[]
    ja: ArticleSection[]
    zh: ArticleSection[]
  }
  readTime: number // 분 단위
  tags: string[]
  sources: Source[]
  lastUpdated: Date | string // JSON에서 로드 시 string, 변환 후 Date
  featured?: boolean
  recommendedProducts?: RecommendedProduct[]
}

export interface RecommendedProduct {
  title: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  description: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  price: number
  affiliate: 'coupang' | 'aladin' | 'amazon'
  link: string
  imageUrl: string
  category: 'book' | 'tool' | 'supplement' | 'device'
}

export interface ArticleSection {
  heading?: string
  paragraphs?: string[]
  list?: {
    type: 'bullet' | 'numbered'
    items: string[]
  }
}

export interface Source {
  name: string
  organization: string
  url: string
  accessDate: string
}

export interface CategoryInfo {
  id: ArticleCategory
  name: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  description: {
    ko: string
    en: string
    ja: string
    zh: string
  }
  icon: string
  color: string
}
