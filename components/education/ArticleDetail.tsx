'use client'

import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { X, Clock, Calendar, ExternalLink, BookOpen, Brain, Heart, Sun, Users, Briefcase } from 'lucide-react'
import { ARTICLE_CATEGORIES, type Article } from '@/types/education'

const iconMap: Record<string, any> = {
  BookOpen,
  Brain,
  Heart,
  Sun,
  Users,
  Briefcase
}

interface ArticleDetailProps {
  article: Article
  onClose: () => void
}

export default function ArticleDetail({ article, onClose }: ArticleDetailProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const category = ARTICLE_CATEGORIES.find(c => c.id === article.category)
  const Icon = category ? iconMap[category.icon] : BookOpen
  const content = article.content[language as keyof typeof article.content]

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
        theme === 'dark' ? 'bg-black/80' : 'bg-black/60'
      }`}
      onClick={onClose}
    >
      <div
        className={`backdrop-blur-xl border rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
          theme === 'dark'
            ? 'bg-black/90 border-white/10'
            : 'bg-white/95 border-gray-700/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            {category && (
              <div
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {category.name[language as keyof typeof category.name]}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className={`flex items-center gap-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {article.readTime}
              {language === 'ko' && '분 읽기'}
              {language === 'en' && ' min read'}
              {language === 'ja' && '分の読書'}
              {language === 'zh' && '分钟阅读'}
            </span>
          </div>
          <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
          <div className={`flex items-center gap-1 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>
              {language === 'ko' && '최근 업데이트: '}
              {language === 'en' && 'Updated: '}
              {language === 'ja' && '更新日: '}
              {language === 'zh' && '更新于: '}
              {formatDate(article.lastUpdated)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-3xl font-light mb-6 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`} style={{ letterSpacing: '0.03em', lineHeight: 1.4 }}>
          {article.title[language as keyof typeof article.title]}
        </h1>

        {/* Summary */}
        <div className={`mb-8 p-4 rounded-lg border-l-4 ${
          theme === 'dark'
            ? 'bg-white/5 border-l-emerald-500'
            : 'bg-emerald-50 border-l-emerald-600'
        }`}>
          <p className={`text-base ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} style={{ lineHeight: 1.8 }}>
            {article.summary[language as keyof typeof article.summary]}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-8">
          {content.map((section, index) => (
            <div key={index}>
              {section.heading && (
                <h2 className={`text-2xl font-medium mb-4 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.02em' }}>
                  {section.heading}
                </h2>
              )}

              {section.paragraphs && section.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className={`text-base mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                  style={{ lineHeight: 1.8 }}
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <div className="mb-4">
                  {section.list.type === 'bullet' ? (
                    <ul className="space-y-2 ml-6">
                      {section.list.items.map((item, iIndex) => (
                        <li
                          key={iIndex}
                          className={`text-base list-disc ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                          style={{ lineHeight: 1.8 }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ol className="space-y-2 ml-6">
                      {section.list.items.map((item, iIndex) => (
                        <li
                          key={iIndex}
                          className={`text-base list-decimal ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                          style={{ lineHeight: 1.8 }}
                        >
                          {item}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`text-sm px-3 py-1 rounded-full ${
                  theme === 'dark'
                    ? 'bg-white/10 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sources */}
        <div className={`pt-6 border-t ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'ko' && '참고 자료'}
            {language === 'en' && 'Sources'}
            {language === 'ja' && '参考資料'}
            {language === 'zh' && '参考资料'}
          </h3>
          <div className="space-y-3">
            {article.sources.map((source, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-sm font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {source.name}
                    </p>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {source.organization}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {language === 'ko' && '접근일: '}
                      {language === 'en' && 'Accessed: '}
                      {language === 'ja' && 'アクセス日: '}
                      {language === 'zh' && '访问日期: '}
                      {source.accessDate}
                    </p>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-white/10 text-emerald-500'
                        : 'hover:bg-gray-200 text-emerald-600'
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className={`mt-6 p-4 rounded-lg text-xs ${
            theme === 'dark'
              ? 'bg-amber-500/10 text-amber-400'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {language === 'ko' && '이 정보는 교육 목적으로만 제공되며 전문적인 의학 조언을 대체하지 않습니다. 건강 문제가 있다면 반드시 전문가와 상담하세요.'}
            {language === 'en' && 'This information is provided for educational purposes only and does not replace professional medical advice. Please consult a healthcare professional for any health concerns.'}
            {language === 'ja' && 'この情報は教育目的でのみ提供されており、専門的な医学的アドバイスに代わるものではありません。健康上の問題がある場合は、必ず専門家に相談してください。'}
            {language === 'zh' && '此信息仅供教育目的，不能替代专业医疗建议。如有健康问题，请务必咨询专业人士。'}
          </div>
        </div>
      </div>
    </div>
  )
}
