'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/layout/AuthProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useRouter } from 'next/navigation'
import EmotionCheckin from '@/components/emotion/EmotionCheckin'
import EmotionHistory from '@/components/emotion/EmotionHistory'
import EmotionGraph from '@/components/emotion/EmotionGraph'
import { Plus, BarChart3, List } from 'lucide-react'
import type { EmotionRecord } from '@/types/emotion'

export default function EmotionPage() {
  const { user, loading } = useAuth()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const router = useRouter()

  const [showCheckin, setShowCheckin] = useState(false)
  const [emotionRecords, setEmotionRecords] = useState<EmotionRecord[]>([])
  const [activeTab, setActiveTab] = useState<'graph' | 'history'>('graph')
  const [period, setPeriod] = useState<'week' | 'month'>('week')

  // Redirect if not logged in (disabled for testing)
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/')
  //   }
  // }, [user, loading, router])

  // TODO: Load emotion records from Firestore
  useEffect(() => {
    // Fetch user's emotion records from Firestore
    // For now, using mock data (works without login for testing)
    const mockRecords: EmotionRecord[] = [
      {
        id: '1',
        userId: user?.uid || 'test-user',
        emotion: 'happy',
        intensity: 7,
        note: '좋은 하루였어요',
        triggers: ['일', '관계'],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: '2',
        userId: user?.uid || 'test-user',
        emotion: 'anxious',
        intensity: 6,
        triggers: ['일'],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: '3',
        userId: user?.uid || 'test-user',
        emotion: 'calm',
        intensity: 8,
        note: '명상 후 평온함',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      },
    ]
    setEmotionRecords(mockRecords)
  }, [user])

  const handleSaveEmotion = (record: EmotionRecord) => {
    // TODO: Save to Firestore
    setEmotionRecords((prev) => [record, ...prev])
    setShowCheckin(false)
  }

  // Removed login check for testing
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <div className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
  //           {language === 'ko' && '로딩 중...'}
  //           {language === 'en' && 'Loading...'}
  //           {language === 'ja' && '読み込み中...'}
  //           {language === 'zh' && '加载中...'}
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // if (!user) {
  //   return null
  // }

  return (
    <div className="min-h-screen py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-light mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`} style={{ letterSpacing: '0.1em' }}>
              {language === 'ko' && '감정 기록'}
              {language === 'en' && 'Emotion Tracking'}
              {language === 'ja' && '感情記録'}
              {language === 'zh' && '情绪追踪'}
            </h1>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              {language === 'ko' && '당신의 감정을 기록하고 패턴을 발견하세요'}
              {language === 'en' && 'Track your emotions and discover patterns'}
              {language === 'ja' && 'あなたの感情を記録してパターンを見つけましょう'}
              {language === 'zh' && '记录你的情绪并发现模式'}
            </p>
          </div>

          {/* Add Emotion Button */}
          <button
            onClick={() => setShowCheckin(true)}
            className={`flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
              theme === 'dark'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>
              {language === 'ko' && '감정 기록'}
              {language === 'en' && 'Log Emotion'}
              {language === 'ja' && '感情を記録'}
              {language === 'zh' && '记录情绪'}
            </span>
          </button>
        </div>

        {/* Emotion Check-in Modal */}
        {showCheckin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <EmotionCheckin
                onSave={handleSaveEmotion}
                onClose={() => setShowCheckin(false)}
              />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className={`flex gap-2 p-1 rounded-lg ${
            theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 rounded-md transition-all text-sm ${
                activeTab === 'graph'
                  ? theme === 'dark'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {language === 'ko' && '분석'}
                {language === 'en' && 'Analysis'}
                {language === 'ja' && '分析'}
                {language === 'zh' && '分析'}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 rounded-md transition-all text-sm ${
                activeTab === 'history'
                  ? theme === 'dark'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>
                {language === 'ko' && '기록'}
                {language === 'en' && 'History'}
                {language === 'ja' && '記録'}
                {language === 'zh' && '记录'}
              </span>
            </button>
          </div>

          {/* Period selector (only for graph view) */}
          {activeTab === 'graph' && (
            <div className={`flex gap-2 p-1 rounded-lg ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setPeriod('week')}
                className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm transition-all ${
                  period === 'week'
                    ? theme === 'dark'
                      ? 'bg-white/10 text-gray-200'
                      : 'bg-white text-gray-800'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                {language === 'ko' && '7일'}
                {language === 'en' && '7 days'}
                {language === 'ja' && '7日間'}
                {language === 'zh' && '7天'}
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm transition-all ${
                  period === 'month'
                    ? theme === 'dark'
                      ? 'bg-white/10 text-gray-200'
                      : 'bg-white text-gray-800'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                {language === 'ko' && '30일'}
                {language === 'en' && '30 days'}
                {language === 'ja' && '30日間'}
                {language === 'zh' && '30天'}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === 'graph' && (
          <EmotionGraph records={emotionRecords} period={period} />
        )}

        {activeTab === 'history' && (
          <EmotionHistory records={emotionRecords} />
        )}
      </div>
    </div>
  )
}
