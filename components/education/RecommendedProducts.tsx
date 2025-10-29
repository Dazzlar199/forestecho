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
    <div className="mt-12 pt-8 border-t-2 border-emerald-200">
      {/* 헤더 섹션 - 배경색과 패딩 추가 */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">{t.title}</h3>
        </div>
        <p className="text-sm text-emerald-700 ml-14">
          전문가가 추천하는 심리 건강 도서와 도구
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group bg-white border-2 border-emerald-100 rounded-xl overflow-hidden hover:shadow-2xl hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.title[language]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                추천
              </div>
            </div>

            <div className="p-5 bg-white">
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors text-base">
                {product.title[language]}
              </h4>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description[language]}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xl font-bold text-emerald-600">
                  ₩{product.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-1 text-sm text-white bg-emerald-500 px-3 py-2 rounded-lg font-medium group-hover:bg-emerald-600 transition-colors">
                  {t.view}
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center bg-gray-50 py-3 rounded-lg">
        {t.affiliate}
      </p>
    </div>
  )
}
