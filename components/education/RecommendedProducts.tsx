'use client'

import { ShoppingBag, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import type { RecommendedProduct } from '@/lib/data/articles'

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
    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t-2 border-emerald-200">
      {/* 헤더 섹션 - 모바일 최적화 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 border-2 border-emerald-200">
        <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
          <div className="bg-emerald-500 p-1 md:p-1.5 rounded-md md:rounded-lg">
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-emerald-900">{t.title}</h3>
        </div>
        <p className="text-[10px] md:text-xs lg:text-sm text-emerald-700 ml-6 md:ml-10">
          전문가가 추천하는 심리 건강 도서와 도구
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group bg-white border border-emerald-100 md:border-2 rounded-md md:rounded-lg overflow-hidden hover:shadow-lg md:hover:shadow-xl hover:border-emerald-400 transition-all duration-300 md:hover:-translate-y-1"
          >
            <div className="aspect-square md:aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.title[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-1 right-1 md:top-1.5 md:right-1.5 bg-emerald-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full">
                추천
              </div>
            </div>

            <div className="p-2 md:p-3 lg:p-4 bg-white">
              <h4 className="font-bold text-gray-900 mb-1 md:mb-1.5 line-clamp-2 group-hover:text-emerald-600 transition-colors text-xs md:text-sm lg:text-base">
                {product.title[language]}
              </h4>

              <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 hidden md:block">
                {product.description[language]}
              </p>

              <div className="flex items-center justify-between pt-1.5 md:pt-2 border-t border-gray-100">
                <span className="text-sm md:text-base lg:text-lg font-bold text-emerald-600">
                  ₩{product.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs lg:text-sm text-white bg-emerald-500 px-1.5 md:px-2 lg:px-3 py-1 md:py-1.5 lg:py-2 rounded md:rounded-lg font-medium group-hover:bg-emerald-600 transition-colors">
                  {t.view}
                  <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] md:text-xs text-gray-500 mt-3 md:mt-4 text-center bg-gray-50 py-1.5 md:py-2 rounded-md md:rounded-lg">
        {t.affiliate}
      </p>
    </div>
  )
}
