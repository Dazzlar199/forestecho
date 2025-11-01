'use client'

import Link from 'next/link'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { Clock, Star } from 'lucide-react'
import { ARTICLE_CATEGORIES, type Article, type ArticleCategory } from '@/types/education'
import { iconMap } from '@/lib/utils/icon-map'

interface ArticleListProps {
  articles: Article[]
  selectedCategory?: ArticleCategory | 'all'
}

export default function ArticleList({
  articles,
  selectedCategory = 'all'
}: ArticleListProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory)

  // Featured articles first, then by date
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.lastUpdated.getTime() - a.lastUpdated.getTime()
  })

  if (sortedArticles.length === 0) {
    return (
      <div className={`text-center py-20 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <p className="text-sm">
          {language === 'ko' && '아티클이 없습니다'}
          {language === 'en' && 'No articles'}
          {language === 'ja' && '記事がありません'}
          {language === 'zh' && '没有文章'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sortedArticles.map((article) => {
        const category = ARTICLE_CATEGORIES.find(c => c.id === article.category)
        const Icon = category ? iconMap[category.icon] : iconMap['BookOpen']

        return (
          <Link
            key={article.id}
            href={`/education/${article.id}`}
            className={`block p-6 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-lg'
            }`}
          >
            {/* Category Badge & Featured */}
            <div className="flex items-center justify-between mb-3">
              {category && (
                <div
                  className="px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color
                  }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="font-medium">
                    {category.name[language as keyof typeof category.name]}
                  </span>
                </div>
              )}
              {article.featured && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-medium">
                    {language === 'ko' && '추천'}
                    {language === 'en' && 'Featured'}
                    {language === 'ja' && 'おすすめ'}
                    {language === 'zh' && '推荐'}
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className={`text-xl font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {article.title[language as keyof typeof article.title]}
            </h3>

            {/* Summary */}
            <p className={`text-sm mb-4 line-clamp-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {article.summary[language as keyof typeof article.summary]}
            </p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-white/10 text-gray-500'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs">
              <div className={`flex items-center gap-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>
                  {article.readTime}
                  {language === 'ko' && '분'}
                  {language === 'en' && ' min'}
                  {language === 'ja' && '分'}
                  {language === 'zh' && '分钟'}
                </span>
              </div>
              <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {language === 'ko' && '출처 '}
                {language === 'en' && 'Sources: '}
                {language === 'ja' && '出典 '}
                {language === 'zh' && '来源 '}
                {article.sources.length}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
