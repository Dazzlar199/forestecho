'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, CheckCircle } from 'lucide-react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { resetPassword, validateEmail } from '@/lib/firebase/auth-email'

interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError(language === 'ko' ? '올바른 이메일 형식이 아닙니다.' : 'Invalid email format.')
      return
    }

    setIsLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
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
            <button
              onClick={handleClose}
              className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-white/10 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              <div className="text-center">
                <div className="inline-block p-4 bg-green-500/10 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className={`text-2xl font-normal mb-4 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {language === 'ko' && '이메일 발송 완료'}
                  {language === 'en' && 'Email Sent'}
                  {language === 'ja' && 'メール送信完了'}
                  {language === 'zh' && '邮件已发送'}
                </h2>
                <p className={`text-sm mb-6 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'ko' && '비밀번호 재설정 링크를 이메일로 보냈습니다. 이메일을 확인해주세요.'}
                  {language === 'en' && 'Password reset link has been sent to your email. Please check your inbox.'}
                  {language === 'ja' && 'パスワードリセットリンクをメールで送信しました。受信箱を確認してください。'}
                  {language === 'zh' && '密码重置链接已发送到您的邮箱。请查收。'}
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  {language === 'ko' && '확인'}
                  {language === 'en' && 'OK'}
                  {language === 'ja' && 'OK'}
                  {language === 'zh' && '确定'}
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-block p-4 bg-emerald-500/10 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className={`text-2xl font-normal mb-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {language === 'ko' && '비밀번호 재설정'}
                    {language === 'en' && 'Reset Password'}
                    {language === 'ja' && 'パスワードリセット'}
                    {language === 'zh' && '重置密码'}
                  </h2>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {language === 'ko' && '가입하신 이메일 주소를 입력하세요'}
                    {language === 'en' && 'Enter your registered email address'}
                    {language === 'ja' && '登録したメールアドレスを入力してください'}
                    {language === 'zh' && '输入您注册的电子邮件地址'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@email.com"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          theme === 'dark'
                            ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                        } focus:outline-none focus:border-emerald-500`}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded-lg transition-colors ${
                      isLoading
                        ? 'bg-emerald-500/30 text-emerald-300 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {language === 'ko' && '전송 중...'}
                        {language === 'en' && 'Sending...'}
                      </div>
                    ) : (
                      <>
                        {language === 'ko' && '재설정 링크 보내기'}
                        {language === 'en' && 'Send Reset Link'}
                        {language === 'ja' && 'リセットリンクを送信'}
                        {language === 'zh' && '发送重置链接'}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
