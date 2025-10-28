'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { Sunrise, Moon, CheckCircle2, Clock } from 'lucide-react'
import MorningCheckin from '@/components/checkin/MorningCheckin'
import EveningCheckin from '@/components/checkin/EveningCheckin'
import RoutineTracker from '@/components/checkin/RoutineTracker'
import { DEFAULT_ROUTINES, type CheckinData, type RoutineItem } from '@/types/checkin'

export default function CheckinPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [showMorningCheckin, setShowMorningCheckin] = useState(false)
  const [showEveningCheckin, setShowEveningCheckin] = useState(false)
  const [morningCompleted, setMorningCompleted] = useState(false)
  const [eveningCompleted, setEveningCompleted] = useState(false)
  const [routines, setRoutines] = useState<RoutineItem[]>([])

  useEffect(() => {
    // Mock data - 기본 루틴 생성
    const mockRoutines: RoutineItem[] = DEFAULT_ROUTINES.map((template, index) => ({
      ...template,
      id: `routine-${index}`,
      userId: 'test-user',
      completed: false,
      streak: Math.floor(Math.random() * 15),
      lastCompletedDate: undefined
    }))
    setRoutines(mockRoutines)

    // Check if check-ins were done today (mock)
    const today = new Date().toDateString()
    const morningDone = localStorage.getItem('morning-checkin-date') === today
    const eveningDone = localStorage.getItem('evening-checkin-date') === today
    setMorningCompleted(morningDone)
    setEveningCompleted(eveningDone)
  }, [])

  const handleMorningComplete = (data: Omit<CheckinData, 'id' | 'userId' | 'timestamp'>) => {
    const today = new Date().toDateString()
    localStorage.setItem('morning-checkin-date', today)
    setMorningCompleted(true)
    setShowMorningCheckin(false)
  }

  const handleEveningComplete = (data: Omit<CheckinData, 'id' | 'userId' | 'timestamp'>) => {
    const today = new Date().toDateString()
    localStorage.setItem('evening-checkin-date', today)
    setEveningCompleted(true)
    setShowEveningCheckin(false)
  }

  const handleToggleRoutine = (routineId: string) => {
    setRoutines(prev => prev.map(r => {
      if (r.id === routineId) {
        const newCompleted = !r.completed
        const today = new Date()

        // 스트릭 계산
        let newStreak = r.streak
        if (newCompleted) {
          const lastDate = r.lastCompletedDate
          if (lastDate) {
            const daysDiff = Math.floor((today.getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24))
            if (daysDiff === 1) {
              newStreak += 1
            } else if (daysDiff > 1) {
              newStreak = 1
            }
          } else {
            newStreak = 1
          }
        }

        return {
          ...r,
          completed: newCompleted,
          streak: newCompleted ? newStreak : r.streak,
          lastCompletedDate: newCompleted ? today : r.lastCompletedDate
        }
      }
      return r
    }))
  }

  const getCurrentHour = () => new Date().getHours()
  const hour = getCurrentHour()
  const isMorning = hour >= 5 && hour < 12
  const isEvening = hour >= 18 || hour < 5

  if (showMorningCheckin) {
    return (
      <div className="min-h-screen py-12 px-6">
        <MorningCheckin
          onComplete={handleMorningComplete}
          onClose={() => setShowMorningCheckin(false)}
        />
      </div>
    )
  }

  if (showEveningCheckin) {
    return (
      <div className="min-h-screen py-12 px-6">
        <EveningCheckin
          onComplete={handleEveningComplete}
          onClose={() => setShowEveningCheckin(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`text-4xl font-light mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.1em' }}>
            {language === 'ko' && '일일 체크인'}
            {language === 'en' && 'Daily Check-in'}
            {language === 'ja' && '毎日のチェックイン'}
            {language === 'zh' && '每日签到'}
          </h1>
          <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '하루를 시작하고 마무리하며 자신을 돌아보세요'}
            {language === 'en' && 'Start and end your day with self-reflection'}
            {language === 'ja' && '一日を始め、終え、自分を振り返りましょう'}
            {language === 'zh' && '开始和结束一天，进行自我反思'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Morning Check-in Card */}
          <div className={`p-8 rounded-lg border-2 ${
            morningCompleted
              ? theme === 'dark'
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-emerald-600/30 bg-emerald-100/50'
              : isMorning
                ? theme === 'dark'
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-amber-600/50 bg-amber-100/50'
                : theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: morningCompleted ? '#10b98120' : '#f59e0b20' }}
              >
                {morningCompleted ? (
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#10b981' }} />
                ) : (
                  <Sunrise className="w-8 h-8" style={{ color: '#f59e0b' }} />
                )}
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-light mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.05em' }}>
                  {language === 'ko' && '아침 체크인'}
                  {language === 'en' && 'Morning Check-in'}
                  {language === 'ja' && '朝のチェックイン'}
                  {language === 'zh' && '早晨签到'}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'ko' && '하루를 긍정적으로 시작하세요'}
                  {language === 'en' && 'Start your day positively'}
                  {language === 'ja' && 'ポジティブに一日を始めましょう'}
                  {language === 'zh' && '积极开始新的一天'}
                </p>
              </div>
            </div>

            {morningCompleted ? (
              <div className={`text-center py-4 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {language === 'ko' && '오늘 아침 체크인 완료!'}
                  {language === 'en' && 'Morning check-in completed!'}
                  {language === 'ja' && '今朝のチェックイン完了！'}
                  {language === 'zh' && '早晨签到完成！'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowMorningCheckin(true)}
                disabled={!isMorning}
                className={`w-full px-6 py-4 rounded-lg transition-all ${
                  isMorning
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : theme === 'dark'
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isMorning ? (
                  <>
                    {language === 'ko' && '체크인 시작'}
                    {language === 'en' && 'Start Check-in'}
                    {language === 'ja' && 'チェックイン開始'}
                    {language === 'zh' && '开始签到'}
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'ko' && '아침 시간에 가능 (5:00-12:00)'}
                      {language === 'en' && 'Available in the morning (5:00-12:00)'}
                      {language === 'ja' && '朝の時間に利用可能 (5:00-12:00)'}
                      {language === 'zh' && '早晨时间可用 (5:00-12:00)'}
                    </span>
                  </div>
                )}
              </button>
            )}
          </div>

          {/* Evening Check-in Card */}
          <div className={`p-8 rounded-lg border-2 ${
            eveningCompleted
              ? theme === 'dark'
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : 'border-emerald-600/30 bg-emerald-100/50'
              : isEvening
                ? theme === 'dark'
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-purple-600/50 bg-purple-100/50'
                : theme === 'dark'
                  ? 'border-white/10 bg-white/5'
                  : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: eveningCompleted ? '#10b98120' : '#8b5cf620' }}
              >
                {eveningCompleted ? (
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#10b981' }} />
                ) : (
                  <Moon className="w-8 h-8" style={{ color: '#8b5cf6' }} />
                )}
              </div>
              <div className="flex-1">
                <h2 className={`text-2xl font-light mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`} style={{ letterSpacing: '0.05em' }}>
                  {language === 'ko' && '저녁 체크인'}
                  {language === 'en' && 'Evening Check-in'}
                  {language === 'ja' && '夜のチェックイン'}
                  {language === 'zh' && '晚间签到'}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {language === 'ko' && '하루를 돌아보며 마무리하세요'}
                  {language === 'en' && 'Reflect and end your day'}
                  {language === 'ja' && '一日を振り返って終えましょう'}
                  {language === 'zh' && '反思并结束一天'}
                </p>
              </div>
            </div>

            {eveningCompleted ? (
              <div className={`text-center py-4 ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {language === 'ko' && '오늘 저녁 체크인 완료!'}
                  {language === 'en' && 'Evening check-in completed!'}
                  {language === 'ja' && '今夜のチェックイン完了！'}
                  {language === 'zh' && '晚间签到完成！'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowEveningCheckin(true)}
                disabled={!isEvening}
                className={`w-full px-6 py-4 rounded-lg transition-all ${
                  isEvening
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : theme === 'dark'
                      ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isEvening ? (
                  <>
                    {language === 'ko' && '체크인 시작'}
                    {language === 'en' && 'Start Check-in'}
                    {language === 'ja' && 'チェックイン開始'}
                    {language === 'zh' && '开始签到'}
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'ko' && '저녁 시간에 가능 (18:00-5:00)'}
                      {language === 'en' && 'Available in the evening (18:00-5:00)'}
                      {language === 'ja' && '夜の時間に利用可能 (18:00-5:00)'}
                      {language === 'zh' && '晚间时间可用 (18:00-5:00)'}
                    </span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Routine Tracker */}
        <div className={`p-8 rounded-lg border ${
          theme === 'dark'
            ? 'bg-black/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}>
          <RoutineTracker
            routines={routines}
            onToggleRoutine={handleToggleRoutine}
          />
        </div>
      </div>
    </div>
  )
}
