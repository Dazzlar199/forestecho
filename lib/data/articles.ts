/**
 * 교육 콘텐츠 데이터 로더
 * JSON 파일에서 아티클 데이터를 로드합니다
 */

import type { Article, CategoryInfo } from '@/types/education'
import articlesData from '@/public/data/articles.json'
import categoriesData from '@/public/data/categories.json'

// Re-export types for convenience
export type { Article, CategoryInfo, ArticleCategory, RecommendedProduct, ArticleSection, Source } from '@/types/education'

// JSON 데이터를 Article 타입으로 변환
export const ARTICLES: Article[] = articlesData.map((article: any) => ({
  ...article,
  lastUpdated: new Date(article.lastUpdated),
}))

// 카테고리 정보
export const ARTICLE_CATEGORIES: CategoryInfo[] = categoriesData as CategoryInfo[]

/**
 * ID로 아티클 찾기
 */
export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((article) => article.id === id)
}

/**
 * 카테고리로 아티클 필터링
 */
export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((article) => article.category === category)
}

/**
 * 추천 아티클 가져오기 (featured)
 */
export function getFeaturedArticles(): Article[] {
  return ARTICLES.filter((article) => article.featured)
}

/**
 * 태그로 아티클 검색
 */
export function getArticlesByTag(tag: string): Article[] {
  return ARTICLES.filter((article) => article.tags.includes(tag))
}

/**
 * 모든 아티클 가져오기
 */
export function getAllArticles(): Article[] {
  return ARTICLES
}

/**
 * 카테고리 정보 가져오기
 */
export function getAllCategories(): CategoryInfo[] {
  return ARTICLE_CATEGORIES
}
