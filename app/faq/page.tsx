'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

export default function FAQPage() {
  const { theme } = useTheme()
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // FAQ 불러오기
  useEffect(() => {
    const q = query(collection(db, 'faqs'), orderBy('order', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const faqsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FAQ[]
      setFAQs(faqsData)
    })

    return () => unsubscribe()
  }, [])

  // 카테고리 추출
  const categories = ['all', ...Array.from(new Set(faqs.map((faq) => faq.category)))]

  // FAQ 필터링
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // 토글
  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className={`w-12 h-12 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <h1 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            자주 묻는 질문
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            궁금한 점을 빠르게 찾아보세요
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="질문 또는 답변 검색..."
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        </div>

        {/* 카테고리 필터 */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === category
                    ? theme === 'dark'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? '전체' : category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ 목록 */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div
              className={`p-8 text-center rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
            >
              <HelpCircle className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {searchQuery ? '검색 결과가 없습니다' : 'FAQ가 아직 등록되지 않았습니다'}
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-2xl overflow-hidden transition-all ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className={`w-full p-6 flex items-start justify-between gap-4 text-left transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {faq.category}
                      </span>
                    </div>
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                    {expandedIds.has(faq.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {expandedIds.has(faq.id) && (
                  <div
                    className={`px-6 pb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 추가 도움말 */}
        <div
          className={`mt-8 p-6 rounded-2xl text-center ${
            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-emerald-50 border border-emerald-200'
          }`}
        >
          <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>원하는 답변을 찾지 못하셨나요?</p>
          <a
            href="/support"
            className={`inline-block px-6 py-3 rounded-xl font-medium transition-all ${
              theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  )
}
