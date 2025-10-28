'use client'

import { useState } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { BookOpen, Brain, Heart, Sun, Users, Briefcase } from 'lucide-react'
import ArticleList from '@/components/education/ArticleList'
import ArticleDetail from '@/components/education/ArticleDetail'
import { ARTICLES, ARTICLE_CATEGORIES, type ArticleCategory } from '@/types/education'

const iconMap: Record<string, any> = {
  BookOpen,
  Brain,
  Heart,
  Sun,
  Users,
  Briefcase
}

export default function EducationPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all')
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)

  const selectedArticle = selectedArticleId
    ? ARTICLES.find(a => a.id === selectedArticleId)
    : null

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {language === 'ko' && '심리 교육'}
            {language === 'en' && 'Mental Health Education'}
            {language === 'ja' && '心理教育'}
            {language === 'zh' && '心理教育'}
          </h1>
          <p className={`text-base ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '신뢰할 수 있는 출처를 바탕으로 한 정신건강 정보'}
            {language === 'en' && 'Mental health information from credible sources'}
            {language === 'ja' && '信頼できる情報源に基づくメンタルヘルス情報'}
            {language === 'zh' && '基于可信来源的心理健康信息'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                selectedCategory === 'all'
                  ? theme === 'dark'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 text-white'
                  : theme === 'dark'
                    ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {language === 'ko' && '전체'}
              {language === 'en' && 'All'}
              {language === 'ja' && '全て'}
              {language === 'zh' && '全部'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ARTICLE_CATEGORIES.map((category) => {
              const Icon = iconMap[category.icon]
              const isSelected = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'shadow-lg'
                      : theme === 'dark'
                        ? 'border-white/10 hover:border-white/30'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    borderColor: isSelected ? category.color : undefined,
                    backgroundColor: isSelected ? `${category.color}15` : undefined
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {Icon && (
                      <Icon
                        className="w-5 h-5"
                        style={{ color: isSelected ? category.color : undefined }}
                      />
                    )}
                    <div>
                      <div className={`text-sm font-medium mb-1 ${
                        isSelected
                          ? theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                          : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {category.name[language as keyof typeof category.name]}
                      </div>
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {category.description[language as keyof typeof category.description]}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Info Banner */}
        <div className={`mb-8 p-4 rounded-lg border-l-4 ${
          theme === 'dark'
            ? 'bg-blue-500/10 border-l-blue-500 text-blue-400'
            : 'bg-blue-50 border-l-blue-600 text-blue-700'
        }`}>
          <p className="text-sm">
            {language === 'ko' && '모든 아티클은 WHO, NIMH, Mayo Clinic 등 신뢰할 수 있는 의료 기관의 자료를 바탕으로 작성되었으며, 각 아티클 하단에 출처가 명시되어 있습니다.'}
            {language === 'en' && 'All articles are based on materials from credible medical organizations such as WHO, NIMH, and Mayo Clinic, with sources listed at the bottom of each article.'}
            {language === 'ja' && 'すべての記事は、WHO、NIMH、Mayo Clinicなどの信頼できる医療機関の資料に基づいて作成されており、各記事の下部に出典が記載されています。'}
            {language === 'zh' && '所有文章均基于WHO、NIMH、Mayo Clinic等可信医疗机构的资料，每篇文章底部都列出了来源。'}
          </p>
        </div>

        {/* Article List */}
        <ArticleList
          articles={ARTICLES}
          onArticleClick={setSelectedArticleId}
          selectedCategory={selectedCategory}
        />

        {/* Article Detail Modal */}
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={() => setSelectedArticleId(null)}
          />
        )}
      </div>
    </div>
  )
}
