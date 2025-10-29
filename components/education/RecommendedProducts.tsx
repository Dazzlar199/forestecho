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
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-6 h-6 text-emerald-600" />
        <h3 className="text-xl font-bold text-gray-800">{t.title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <a
            key={index}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title[language]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <h4 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                {product.title[language]}
              </h4>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description[language]}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-600">
                  ₩{product.price.toLocaleString()}
                </span>

                <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                  {t.view}
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        {t.affiliate}
      </p>
    </div>
  )
}
