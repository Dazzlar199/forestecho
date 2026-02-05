'use client'

import { useState } from 'react'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { signUpWithEmail, validatePassword, validateEmail } from '@/lib/firebase/auth-email'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailSignUpFormProps {
  onSuccess: () => void
  onSwitchToSignIn: () => void
}

export default function EmailSignUpForm({ onSuccess, onSwitchToSignIn }: EmailSignUpFormProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordValidation = password ? validatePassword(password) : null
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!validateEmail(email)) {
      setError(language === 'ko' ? '올바른 이메일 형식이 아닙니다.' : 'Invalid email format.')
      return
    }

    if (!passwordValidation?.isValid) {
      setError(passwordValidation?.message || '')
      return
    }

    if (password !== confirmPassword) {
      setError(language === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      await signUpWithEmail({
        email,
        password,
        displayName: displayName.trim() || undefined,
      })

      const successMsg = language === 'ko' ? '회원가입이 완료되었습니다!\n이메일로 인증 링크를 보냈습니다.' :
                         language === 'en' ? 'Sign up complete!\nVerification email sent.' :
                         language === 'ja' ? '会員登録が完了しました！\nメールで認証リンクを送信しました。' :
                         '注册完成！\n已发送验证邮件。'
      alert(successMsg)

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이름 (선택) */}
      <div>
        <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ko' && '이름 (선택)'}
          {language === 'en' && 'Name (Optional)'}
          {language === 'ja' && '名前（オプション）'}
          {language === 'zh' && '姓名（可选）'}
        </label>
        <div className="relative">
          <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={language === 'ko' ? '홍길동' : 'John Doe'}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            } focus:outline-none focus:border-emerald-500`}
          />
        </div>
      </div>

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
        {passwordValidation && (
          <div className={`flex items-center gap-2 mt-2 text-xs ${
            passwordValidation.isValid ? 'text-green-500' : 'text-red-500'
          }`}>
            {passwordValidation.isValid ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{passwordValidation.message}</span>
          </div>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {language === 'ko' && '비밀번호 확인'}
          {language === 'en' && 'Confirm Password'}
          {language === 'ja' && 'パスワード確認'}
          {language === 'zh' && '确认密码'}
        </label>
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
            } focus:outline-none focus:border-emerald-500`}
          />
        </div>
        {confirmPassword && (
          <div className={`flex items-center gap-2 mt-2 text-xs ${
            passwordsMatch ? 'text-green-500' : 'text-red-500'
          }`}>
            {passwordsMatch ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{language === 'ko' ? '비밀번호가 일치합니다' : 'Passwords match'}</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>{language === 'ko' ? '비밀번호가 일치하지 않습니다' : 'Passwords do not match'}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isLoading || !passwordValidation?.isValid || !passwordsMatch}
        className={`w-full py-3 rounded-lg transition-colors ${
          isLoading || !passwordValidation?.isValid || !passwordsMatch
            ? 'bg-emerald-500/30 text-emerald-300 cursor-not-allowed'
            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {language === 'ko' && '처리 중...'}
            {language === 'en' && 'Processing...'}
          </div>
        ) : (
          <>
            {language === 'ko' && '회원가입'}
            {language === 'en' && 'Sign Up'}
            {language === 'ja' && '登録'}
            {language === 'zh' && '注册'}
          </>
        )}
      </button>

      {/* 로그인으로 전환 */}
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className={`text-sm ${
            theme === 'dark' ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
          }`}
        >
          {language === 'ko' && '이미 계정이 있으신가요? 로그인'}
          {language === 'en' && 'Already have an account? Sign In'}
          {language === 'ja' && 'すでにアカウントをお持ちですか？ログイン'}
          {language === 'zh' && '已有账户？登录'}
        </button>
      </div>
    </form>
  )
}
