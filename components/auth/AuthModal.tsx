'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { applyStoredReferralCode } from '@/lib/referral/referral-client'
import EmailSignUpForm from './EmailSignUpForm'
import EmailSignInForm from './EmailSignInForm'
import PasswordResetModal from './PasswordResetModal'
import { logger } from '@/lib/utils/logger'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup'
type AuthMethod = 'social' | 'email'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('social')
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleAuth = async () => {
    setError('')
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Apply referral code if exists (non-blocking)
      applyStoredReferralCode(result.user.uid).catch((err) =>
        logger.error('Failed to apply referral code:', err)
      )

      onClose()
    } catch (err: any) {
      logger.error('Google auth error:', err)

      if (err.code === 'auth/popup-blocked') {
        setError(language === 'ko' ? '팝업이 차단되었습니다.' : 'Popup blocked.')
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError(language === 'ko' ? '로그인이 취소되었습니다.' : 'Login cancelled.')
      } else if (err.code !== 'auth/cancelled-popup-request') {
        setError(language === 'ko' ? 'Google 로그인 실패' : 'Google login failed.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = async () => {
    // 회원가입/로그인 성공 시 referral 코드 적용
    if (auth.currentUser) {
      applyStoredReferralCode(auth.currentUser.uid).catch((err) =>
        logger.error('Failed to apply referral code:', err)
      )
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl border p-8 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-emerald-500/30'
                  : 'bg-white border-emerald-300'
              }`}
            >
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-white/10 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              {/* 헤더 */}
              <div className="text-center mb-8">
                <h2 className={`text-2xl font-normal mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {authMode === 'signin' ? (
                    <>
                      {language === 'ko' && '로그인'}
                      {language === 'en' && 'Sign In'}
                      {language === 'ja' && 'ログイン'}
                      {language === 'zh' && '登录'}
                    </>
                  ) : (
                    <>
                      {language === 'ko' && '회원가입'}
                      {language === 'en' && 'Sign Up'}
                      {language === 'ja' && '登録'}
                      {language === 'zh' && '注册'}
                    </>
                  )}
                </h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'ko' && '숲울림에 오신 것을 환영합니다'}
                  {language === 'en' && 'Welcome to ForestEcho'}
                  {language === 'ja' && 'ForestEchoへようこそ'}
                  {language === 'zh' && '欢迎来到ForestEcho'}
                </p>
              </div>

              {/* 인증 방법 선택 탭 */}
              <div className={`flex gap-2 mb-6 p-1 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <button
                  onClick={() => setAuthMethod('social')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    authMethod === 'social'
                      ? theme === 'dark'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-500 text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  {language === 'ko' && '소셜 로그인'}
                  {language === 'en' && 'Social'}
                  {language === 'ja' && 'ソーシャル'}
                  {language === 'zh' && '社交'}
                </button>
                <button
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    authMethod === 'email'
                      ? theme === 'dark'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-500 text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  {language === 'ko' && '이메일'}
                  {language === 'en' && 'Email'}
                  {language === 'ja' && 'メール'}
                  {language === 'zh' && '电子邮件'}
                </button>
              </div>

              {/* 인증 폼 */}
              <AnimatePresence mode="wait">
                {authMethod === 'social' ? (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <button
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border transition-all ${
                        theme === 'dark'
                          ? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {language === 'ko' && 'Google로 계속하기'}
                      {language === 'en' && 'Continue with Google'}
                      {language === 'ja' && 'Googleで続ける'}
                      {language === 'zh' && '使用Google继续'}
                    </button>

                    {error && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setAuthMethod('email')}
                        className={`text-sm ${
                          theme === 'dark'
                            ? 'text-gray-500 hover:text-gray-400'
                            : 'text-gray-600 hover:text-gray-700'
                        }`}
                      >
                        {language === 'ko' && '또는 이메일로 계속하기'}
                        {language === 'en' && 'Or continue with email'}
                        {language === 'ja' && 'またはメールで続ける'}
                        {language === 'zh' && '或使用电子邮件继续'}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {authMode === 'signin' ? (
                      <EmailSignInForm
                        onSuccess={handleSuccess}
                        onSwitchToSignUp={() => setAuthMode('signup')}
                        onForgotPassword={() => setShowPasswordReset(true)}
                      />
                    ) : (
                      <EmailSignUpForm
                        onSuccess={handleSuccess}
                        onSwitchToSignIn={() => setAuthMode('signin')}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PasswordResetModal
        isOpen={showPasswordReset}
        onClose={() => setShowPasswordReset(false)}
      />
    </>
  )
}
