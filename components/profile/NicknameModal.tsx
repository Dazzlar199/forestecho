'use client'
import { logger } from '@/lib/utils/logger'

import { useState } from 'react'
import { useTheme } from '../layout/ThemeProvider'
import { useLanguage } from '../layout/LanguageProvider'
import { useAuth } from '../layout/AuthProvider'
import { updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { X } from 'lucide-react'

interface NicknameModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NicknameModal({ isOpen, onClose }: NicknameModalProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const { user } = useAuth()
  const [nickname, setNickname] = useState(user?.displayName || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) {
      setError(language === 'ko' ? '닉네임을 입력해주세요' : 'Please enter a nickname')
      return
    }

    if (nickname.length < 2 || nickname.length > 20) {
      setError(language === 'ko' ? '닉네임은 2-20자여야 합니다' : 'Nickname must be 2-20 characters')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: nickname.trim()
        })
        onClose()
      }
    } catch (error: any) {
      logger.error('Nickname update error:', error)
      setError(language === 'ko' ? '닉네임 변경에 실패했습니다' : 'Failed to update nickname')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
        theme === 'dark' ? 'bg-black/80' : 'bg-black/60'
      }`}
      onClick={onClose}
    >
      <div
        className={`backdrop-blur-xl border rounded-lg p-8 max-w-md w-full ${
          theme === 'dark'
            ? 'bg-black/90 border-white/10'
            : 'bg-white/95 border-gray-700/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-light ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '닉네임 설정'}
            {language === 'en' && 'Set Nickname'}
            {language === 'ja' && 'ニックネーム設定'}
            {language === 'zh' && '设置昵称'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-sm mb-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} style={{ lineHeight: 1.6 }}>
          {language === 'ko' && '나의 숲에서 사용할 닉네임을 설정해주세요'}
          {language === 'en' && 'Set a nickname to use in your forest'}
          {language === 'ja' && 'あなたの森で使用するニックネームを設定してください'}
          {language === 'zh' && '设置在您的森林中使用的昵称'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className={`block text-sm mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`} style={{ letterSpacing: '0.03em' }}>
              {language === 'ko' && '닉네임'}
              {language === 'en' && 'Nickname'}
              {language === 'ja' && 'ニックネーム'}
              {language === 'zh' && '昵称'}
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border backdrop-blur-sm transition-all ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-gray-200 focus:border-emerald-500/50 focus:bg-white/10'
                  : 'bg-white/50 border-gray-300 text-gray-800 focus:border-emerald-600 focus:bg-white/80'
              }`}
              placeholder={
                language === 'ko' ? '2-20자' :
                language === 'en' ? '2-20 characters' :
                language === 'ja' ? '2-20文字' :
                '2-20个字符'
              }
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ fontWeight: 300, letterSpacing: '0.08em' }}
          >
            {loading
              ? (language === 'ko' ? '저장 중...' :
                 language === 'en' ? 'Saving...' :
                 language === 'ja' ? '保存中...' : '保存中...')
              : (language === 'ko' ? '저장' :
                 language === 'en' ? 'Save' :
                 language === 'ja' ? '保存' : '保存')}
          </button>
        </form>
      </div>
    </div>
  )
}
