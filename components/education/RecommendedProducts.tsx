'use client'

import { ShoppingBag, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import type { RecommendedProduct } from '@/types/education'

interface RecommendedProductsProps {
  products: RecommendedProduct[]
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
  const { language } = useLanguage()

  const translations = {
    ko: {
      title: '이 글과 함께 읽으면 좋은 추천 도서·상품',
      view: '상품 보기',
      affiliate: '파트너스 활동으로 일정 수수료를 제공받을 수 있습니다'
    },
    en: {
      title: 'Recommended Books & Products',
      view: 'View Product',
      affiliate: 'We may earn a commission through affiliate links'
    },
    ja: {
      title: 'おすすめの書籍・商品',
      view: '商品を見る',
      affiliate: 'アフィリエイトリンクから手数料を得る場合があります'
    },
    zh: {
      title: '推荐书籍与商品',
      view: '查看商品',
      affiliate: '我们可能通过联盟链接获得佣金'
    }
  }

  const t = translations[language]

  return (
    <div className="mt-8 pt-6 border-t-2 border-emerald-200">
      {/* 헤더 섹션 - 크기 축소 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border-2 border-emerald-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-emerald-900">{t.title}</h3>
        </div>
        <p className="text-xs md:text-sm text-emerald-700 ml-10">
          전문가가 추천하는 심리 건강 도서와 도구
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group bg-white border-2 border-emerald-100 rounded-lg overflow-hidden hover:shadow-xl hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/5] md:aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.title[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                추천
              </div>
            </div>

            <div className="p-3 md:p-4 bg-white">
              <h4 className="font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-emerald-600 transition-colors text-sm md:text-base">
                {product.title[language]}
              </h4>

              <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description[language]}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-base md:text-lg font-bold text-emerald-600">
                  ₩{product.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-1 text-xs md:text-sm text-white bg-emerald-500 px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium group-hover:bg-emerald-600 transition-colors">
                  {t.view}
                  <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center bg-gray-50 py-2 rounded-lg">
        {t.affiliate}
      </p>
    </div>
  )
}
