'use client'

import { useLanguage } from '@/components/layout/LanguageProvider'
import Link from 'next/link'
import { ChevronLeft, Clock, Calendar, ExternalLink } from 'lucide-react'
import { ARTICLE_CATEGORIES } from '@/types/education'
import type { Article } from '@/types/education'
import RecommendedProducts from './RecommendedProducts'
import { iconMap } from '@/lib/utils/icon-map'

interface ArticleContentProps {
  article: Article
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const { language } = useLanguage()
  const category = ARTICLE_CATEGORIES.find(c => c.id === article.category)
  const Icon = category ? iconMap[category.icon] : iconMap['BookOpen']
  // Fallback to Korean if the selected language content doesn't exist
  const content = article.content[language] || article.content.ko

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}.${month}.${day}`
  }

  const translations = {
    ko: {
      backToList: '심리 교육 목록으로 돌아가기',
      readTime: '분 읽기',
      lastUpdated: '최근 업데이트',
      references: '참고 자료',
      accessDate: '접근일',
      disclaimer: '이 정보는 교육 목적으로만 제공되며 전문적인 의학 조언을 대체하지 않습니다. 건강 문제가 있다면 반드시 전문가와 상담하세요.',
      adPlaceholder: '광고 영역',
      adNote: 'AdSense 승인 후 활성화됩니다',
      adTop: '(상단)',
      adMiddle: '(중간)',
      adBottom: '(하단)'
    },
    en: {
      backToList: 'Back to Psychology Education',
      readTime: 'min read',
      lastUpdated: 'Last updated',
      references: 'References',
      accessDate: 'Accessed',
      disclaimer: 'This information is provided for educational purposes only and does not replace professional medical advice. If you have health concerns, please consult with a professional.',
      adPlaceholder: 'Ad Space',
      adNote: 'Will be activated after AdSense approval',
      adTop: '(Top)',
      adMiddle: '(Middle)',
      adBottom: '(Bottom)'
    },
    zh: {
      backToList: '返回心理教育列表',
      readTime: '分钟阅读',
      lastUpdated: '最后更新',
      references: '参考资料',
      accessDate: '访问日期',
      disclaimer: '此信息仅供教育目的，不能替代专业医疗建议。如有健康问题，请务必咨询专业人士。',
      adPlaceholder: '广告区域',
      adNote: 'AdSense批准后将激活',
      adTop: '(顶部)',
      adMiddle: '(中间)',
      adBottom: '(底部)'
    },
    ja: {
      backToList: '心理教育リストに戻る',
      readTime: '分読む',
      lastUpdated: '最終更新',
      references: '参考資料',
      accessDate: 'アクセス日',
      disclaimer: 'この情報は教育目的でのみ提供されており、専門的な医療アドバイスに代わるものではありません。健康上の問題がある場合は、必ず専門家に相談してください。',
      adPlaceholder: '広告エリア',
      adNote: 'AdSense承認後に有効化されます',
      adTop: '(上部)',
      adMiddle: '(中央)',
      adBottom: '(下部)'
    }
  }

  const t = translations[language]

  return (
    <div className="min-h-screen py-16 md:py-20 lg:py-32 px-3 sm:px-4 md:px-6">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/education"
          className="inline-flex items-center gap-1.5 md:gap-2 mb-4 md:mb-6 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="text-xs md:text-sm">{t.backToList}</span>
        </Link>

        {/* Category Badge */}
        {category && (
          <div className="mb-4 md:mb-6">
            <div
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color
              }}
            >
              {Icon && <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              <span className="text-xs md:text-sm font-medium">
                {category.name[language]}
              </span>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-gray-500 flex-wrap">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{article.readTime}{t.readTime}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[11px] md:text-sm">{t.lastUpdated}: {formatDate(article.lastUpdated)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6 text-gray-200" style={{ letterSpacing: '0.03em', lineHeight: 1.4 }}>
          {article.title[language]}
        </h1>

        {/* Summary */}
        <div className="mb-6 md:mb-8 p-3 md:p-4 lg:p-5 rounded-lg border-l-4 bg-white/5 border-l-emerald-500">
          <p className="text-sm md:text-base text-gray-300" style={{ lineHeight: 1.8 }}>
            {article.summary[language]}
          </p>
        </div>

        {/* Ad Placeholder - Top */}
        <div className="mb-6 md:mb-8 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 text-center text-gray-500 text-xs md:text-sm">
          {t.adPlaceholder} {t.adTop} - {t.adNote}
        </div>

        {/* Article Content */}
        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {content.map((section, index) => (
            <div key={index}>
              {section.heading && (
                <h2 className="text-xl md:text-2xl font-medium mb-3 md:mb-4 text-gray-200" style={{ letterSpacing: '0.02em' }}>
                  {section.heading}
                </h2>
              )}

              {section.paragraphs && section.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-sm md:text-base mb-3 md:mb-4 text-gray-300"
                  style={{ lineHeight: 1.8 }}
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <div className="mb-3 md:mb-4">
                  {section.list.type === 'bullet' ? (
                    <ul className="space-y-2 ml-4 md:ml-6">
                      {section.list.items.map((item, iIndex) => (
                        <li
                          key={iIndex}
                          className="text-sm md:text-base list-disc text-gray-300"
                          style={{ lineHeight: 1.8 }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ol className="space-y-2 ml-4 md:ml-6">
                      {section.list.items.map((item, iIndex) => (
                        <li
                          key={iIndex}
                          className="text-sm md:text-base list-decimal text-gray-300"
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

        {/* Ad Placeholder - Middle */}
        <div className="mb-6 md:mb-8 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 text-center text-gray-500 text-xs md:text-sm">
          {t.adPlaceholder} {t.adMiddle} - {t.adNote}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-white/10 text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sources */}
        <div className="pt-4 md:pt-6 border-t border-white/10">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-gray-300">
            {t.references}
          </h3>
          <div className="space-y-2 md:space-y-3">
            {article.sources.map((source, index) => (
              <div
                key={index}
                className="p-3 md:p-4 rounded-lg border bg-white/5 border-white/10"
              >
                <div className="flex items-start justify-between gap-2 md:gap-4">
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium mb-1 text-gray-300">
                      {source.name}
                    </p>
                    <p className="text-[10px] md:text-xs mb-1 md:mb-2 text-gray-500">
                      {source.organization}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600">
                      {t.accessDate}: {source.accessDate}
                    </p>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 md:p-2 rounded transition-colors hover:bg-white/10 text-emerald-500"
                  >
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg text-[10px] md:text-xs bg-amber-500/10 text-amber-400">
            {t.disclaimer}
          </div>
        </div>

        {/* Recommended Products */}
        {article.recommendedProducts && article.recommendedProducts.length > 0 && (
          <RecommendedProducts products={article.recommendedProducts} />
        )}

        {/* Ad Placeholder - Bottom */}
        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 text-center text-gray-500 text-xs md:text-sm">
          {t.adPlaceholder} {t.adBottom} - {t.adNote}
        </div>
      </article>
    </div>
  )
}
