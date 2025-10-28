'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { useAuth } from '../layout/AuthProvider'
import { emotionConfig, emotionTriggers, type EmotionType, type EmotionRecord } from '@/types/emotion'
import { ChevronRight, Save, X, Laugh, Smile, Wind, Minus, AlertCircle, CloudRain, Flame, Zap } from 'lucide-react'

// Icon mapping
const emotionIconMap: Record<string, any> = {
  Laugh,
  Smile,
  Wind,
  Minus,
  AlertCircle,
  CloudRain,
  Flame,
  Zap,
}

interface EmotionCheckinProps {
  onSave?: (record: EmotionRecord) => void
  onClose?: () => void
}

export default function EmotionCheckin({ onSave, onClose }: EmotionCheckinProps) {
  const { language, t } = useLanguage()
  const { theme } = useTheme()
  const { user } = useAuth()

  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(null)
  const [intensity, setIntensity] = useState(5)
  const [note, setNote] = useState('')
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [step, setStep] = useState<'emotion' | 'intensity' | 'triggers' | 'note'>('emotion')

  const emotions = Object.keys(emotionConfig) as EmotionType[]
  const triggers = emotionTriggers[language as keyof typeof emotionTriggers]

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev =>
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleSave = async () => {
    if (!selectedEmotion) return

    const record: EmotionRecord = {
      id: Date.now().toString(),
      userId: user?.uid || 'test-user',
      emotion: selectedEmotion,
      intensity,
      note: note.trim() || undefined,
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined,
      timestamp: new Date(),
    }

    // TODO: Firestore에 저장
    if (onSave) {
      onSave(record)
    }

    // Reset and close
    setSelectedEmotion(null)
    setIntensity(5)
    setNote('')
    setSelectedTriggers([])
    setStep('emotion')
    if (onClose) {
      onClose()
    }
  }

  const canProceed = () => {
    if (step === 'emotion') return selectedEmotion !== null
    if (step === 'intensity') return true
    if (step === 'triggers') return true
    if (step === 'note') return true
    return false
  }

  const nextStep = () => {
    if (step === 'emotion') setStep('intensity')
    else if (step === 'intensity') setStep('triggers')
    else if (step === 'triggers') setStep('note')
    else if (step === 'note') handleSave()
  }

  return (
    <div className={`backdrop-blur-xl border rounded-lg p-8 ${
      theme === 'dark'
        ? 'bg-black/80 border-white/10'
        : 'bg-white/90 border-gray-700/20'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className={`text-2xl font-light mb-2 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '지금 기분이 어떠신가요?'}
            {language === 'en' && 'How are you feeling?'}
            {language === 'ja' && '今の気分はいかがですか？'}
            {language === 'zh' && '你现在感觉如何？'}
          </h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {language === 'ko' && '솔직한 감정을 기록해보세요'}
            {language === 'en' && 'Record your honest feelings'}
            {language === 'ja' && '正直な気持ちを記録してみましょう'}
            {language === 'zh' && '记录你的真实感受'}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
          }`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2 mb-8">
        {['emotion', 'intensity', 'triggers', 'note'].map((s, i) => (
          <div
            key={s}
            className={`flex-1 h-1 rounded-full transition-all ${
              step === s
                ? theme === 'dark' ? 'bg-emerald-500' : 'bg-emerald-600'
                : (i < ['emotion', 'intensity', 'triggers', 'note'].indexOf(step))
                  ? theme === 'dark' ? 'bg-emerald-500/50' : 'bg-emerald-600/50'
                  : theme === 'dark' ? 'bg-white/10' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Step: Select Emotion */}
      {step === 'emotion' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((emotion) => {
              const config = emotionConfig[emotion]
              const isSelected = selectedEmotion === emotion
              const EmotionIcon = emotionIconMap[config.iconName]
              return (
                <button
                  key={emotion}
                  onClick={() => setSelectedEmotion(emotion)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-current shadow-lg scale-105'
                      : theme === 'dark'
                        ? 'border-white/10 hover:border-white/30'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    color: isSelected ? config.color : undefined,
                  }}
                >
                  <div className="mb-3 flex justify-center">
                    <EmotionIcon className="w-10 h-10" style={{ color: isSelected ? config.color : theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                  </div>
                  <div className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {config.name[language as keyof typeof config.name]}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step: Intensity */}
      {step === 'intensity' && selectedEmotion && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {(() => {
                const IntensityIcon = emotionIconMap[emotionConfig[selectedEmotion].iconName]
                return <IntensityIcon className="w-16 h-16" style={{ color: emotionConfig[selectedEmotion].color }} />
              })()}
            </div>
            <div className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {emotionConfig[selectedEmotion].name[language as keyof typeof emotionConfig[typeof selectedEmotion]['name']]}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'ko' && '약함'}
                {language === 'en' && 'Weak'}
                {language === 'ja' && '弱い'}
                {language === 'zh' && '弱'}
              </span>
              <span className={`text-2xl font-light ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {intensity}
              </span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {language === 'ko' && '강함'}
                {language === 'en' && 'Strong'}
                {language === 'ja' && '強い'}
                {language === 'zh' && '强'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-emerald-500"
              style={{ height: '8px' }}
            />
          </div>
        </div>
      )}

      {/* Step: Triggers */}
      {step === 'triggers' && (
        <div className="space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '이 감정의 원인은 무엇인가요? (선택사항)'}
            {language === 'en' && 'What triggered this emotion? (Optional)'}
            {language === 'ja' && 'この感情の原因は何ですか？（任意）'}
            {language === 'zh' && '这种情绪的原因是什么？（可选）'}
          </p>
          <div className="flex flex-wrap gap-2">
            {triggers.map((trigger) => (
              <button
                key={trigger}
                onClick={() => toggleTrigger(trigger)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTriggers.includes(trigger)
                    ? theme === 'dark'
                      ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500'
                      : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-600'
                    : theme === 'dark'
                      ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {trigger}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Note */}
      {step === 'note' && (
        <div className="space-y-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ko' && '더 기록하고 싶은 내용이 있나요? (선택사항)'}
            {language === 'en' && 'Anything else to note? (Optional)'}
            {language === 'ja' && '他に記録したいことはありますか？（任意）'}
            {language === 'zh' && '还有什么要记录的吗？（可选）'}
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              language === 'ko' ? '오늘 무슨 일이 있었나요?' :
              language === 'en' ? 'What happened today?' :
              language === 'ja' ? '今日は何がありましたか？' :
              '今天发生了什么？'
            }
            rows={6}
            className={`w-full p-4 rounded-lg border resize-none ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            }`}
            style={{ fontWeight: 300, lineHeight: 1.8 }}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {step !== 'emotion' && (
          <button
            onClick={() => {
              if (step === 'intensity') setStep('emotion')
              else if (step === 'triggers') setStep('intensity')
              else if (step === 'note') setStep('triggers')
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {language === 'ko' && '이전'}
            {language === 'en' && 'Back'}
            {language === 'ja' && '戻る'}
            {language === 'zh' && '返回'}
          </button>
        )}
        <button
          onClick={nextStep}
          disabled={!canProceed()}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
            canProceed()
              ? theme === 'dark'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {step === 'note' ? (
            <>
              <Save className="w-5 h-5" />
              <span>
                {language === 'ko' && '저장'}
                {language === 'en' && 'Save'}
                {language === 'ja' && '保存'}
                {language === 'zh' && '保存'}
              </span>
            </>
          ) : (
            <>
              <span>
                {language === 'ko' && '다음'}
                {language === 'en' && 'Next'}
                {language === 'ja' && '次へ'}
                {language === 'zh' && '下一步'}
              </span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
