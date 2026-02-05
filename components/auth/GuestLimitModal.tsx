'use client'

import { X, Sparkles } from 'lucide-react'
import { useLanguage } from '@/components/layout/LanguageProvider'

interface GuestLimitModalProps {
  isOpen: boolean
  onClose: () => void
  onSignUp: () => void
}

export default function GuestLimitModal({
  isOpen,
  onClose,
  onSignUp,
}: GuestLimitModalProps) {
  const { language } = useLanguage()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label={language === 'ko' ? '닫기' : language === 'en' ? 'Close' : language === 'ja' ? '閉じる' : '关闭'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-medium text-gray-100 mb-3">
            {language === 'ko' && '무료 체험이 끝났어요'}
            {language === 'en' && 'Free Trial Ended'}
            {language === 'ja' && '無料体験が終了しました'}
            {language === 'zh' && '免费试用已结束'}
          </h2>

          <p className="text-gray-400 mb-6 leading-relaxed">
            {language === 'ko' && (
              <>
                지금까지 3회의 대화를 나눴어요.
                <br />
                계속 대화하려면 무료 회원가입을 해주세요.
              </>
            )}
            {language === 'en' && (
              <>
                You've had 3 conversations so far.
                <br />
                Sign up for free to continue chatting.
              </>
            )}
            {language === 'ja' && (
              <>
                これまでに3回の会話をしました。
                <br />
                会話を続けるには無料会員登録をしてください。
              </>
            )}
            {language === 'zh' && (
              <>
                您已进行了3次对话。
                <br />
                请免费注册以继续聊天。
              </>
            )}
          </p>

          {/* Benefits */}
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-300 mb-2 font-medium">
              {language === 'ko' && '회원가입 하면'}
              {language === 'en' && 'Sign up benefits'}
              {language === 'ja' && '会員登録すると'}
              {language === 'zh' && '注册后可享受'}
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>
                  {language === 'ko' && '일일 3회 무료 대화 (매일 자정 리셋)'}
                  {language === 'en' && '3 free chats daily (resets at midnight)'}
                  {language === 'ja' && '1日3回無料会話（毎日深夜リセット）'}
                  {language === 'zh' && '每日3次免费对话（每天午夜重置）'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>
                  {language === 'ko' && '대화 히스토리 자동 저장'}
                  {language === 'en' && 'Auto-save chat history'}
                  {language === 'ja' && '会話履歴の自動保存'}
                  {language === 'zh' && '自动保存聊天记录'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>
                  {language === 'ko' && '주간 감정 요약 리포트'}
                  {language === 'en' && 'Weekly emotion summary report'}
                  {language === 'ja' && '週間感情サマリーレポート'}
                  {language === 'zh' && '每周情绪摘要报告'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>
                  {language === 'ko' && '모든 상담 모드 이용 가능'}
                  {language === 'en' && 'Access to all counseling modes'}
                  {language === 'ja' && 'すべてのカウンセリングモードが利用可能'}
                  {language === 'zh' && '访问所有咨询模式'}
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={onSignUp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors mb-3"
          >
            {language === 'ko' && '무료 회원가입하고 계속하기'}
            {language === 'en' && 'Sign Up Free & Continue'}
            {language === 'ja' && '無料会員登録して続ける'}
            {language === 'zh' && '免费注册并继续'}
          </button>

          <p className="text-xs text-gray-500">
            {language === 'ko' && '이메일 또는 Google 계정으로 간편 가입'}
            {language === 'en' && 'Easy sign up with email or Google'}
            {language === 'ja' && 'メールまたはGoogleアカウントで簡単登録'}
            {language === 'zh' && '使用电子邮件或Google账户轻松注册'}
          </p>
        </div>
      </div>
    </div>
  )
}
