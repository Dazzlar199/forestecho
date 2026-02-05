'use client'

import { useState } from 'react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { signInWithEmail } from '@/lib/firebase/auth-email'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

interface EmailSignInFormProps {
  onSuccess: () => void
  onSwitchToSignUp: () => void
  onForgotPassword: () => void
}

export default function EmailSignInForm({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
}: EmailSignInFormProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signInWithEmail({ email, password })
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이메일 */}
      <div>
        <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ko' && '이메일'}
          {language === 'en' && 'Email'}
          {language === 'ja' && 'メール'}
          {language === 'zh' && '电子邮件'}
        </label>
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

      {/* 비밀번호 */}
      <div>
        <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ko' && '비밀번호'}
          {language === 'en' && 'Password'}
          {language === 'ja' && 'パスワード'}
          {language === 'zh' && '密码'}
        </label>
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={`w-full pl-10 pr-12 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            } focus:outline-none focus:border-emerald-500`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 비밀번호 찾기 */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-700'
          }`}
        >
          {language === 'ko' && '비밀번호를 잊으셨나요?'}
          {language === 'en' && 'Forgot password?'}
          {language === 'ja' && 'パスワードをお忘れですか？'}
          {language === 'zh' && '忘记密码？'}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* 로그인 버튼 */}
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
            {language === 'ko' && '로그인 중...'}
            {language === 'en' && 'Signing in...'}
          </div>
        ) : (
          <>
            {language === 'ko' && '로그인'}
            {language === 'en' && 'Sign In'}
            {language === 'ja' && 'ログイン'}
            {language === 'zh' && '登录'}
          </>
        )}
      </button>

      {/* 회원가입으로 전환 */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className={`text-sm ${
            theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          {language === 'ko' && '계정이 없으신가요? 회원가입'}
          {language === 'en' && "Don't have an account? Sign Up"}
          {language === 'ja' && 'アカウントをお持ちでないですか？登録'}
          {language === 'zh' && '没有账户？注册'}
        </button>
      </div>
    </form>
  )
}
