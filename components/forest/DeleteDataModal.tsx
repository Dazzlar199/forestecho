'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { logger } from '@/lib/utils/logger'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useLanguage } from '@/components/layout/LanguageProvider'

interface DeleteDataModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteDataModal({ isOpen, onClose, onConfirm }: DeleteDataModalProps) {
  const { theme } = useTheme()
  const { language } = useLanguage()
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const getConfirmWord = () => {
    if (language === 'ko') return '삭제'
    if (language === 'en') return 'DELETE'
    if (language === 'ja') return '削除'
    return '删除'
  }

  const confirmWord = getConfirmWord()

  const handleConfirm = async () => {
    if (confirmText !== confirmWord) return

    setIsDeleting(true)
    try {
      await onConfirm()
      setConfirmText('')
      onClose()
    } catch (error) {
      logger.error('Delete failed:', error)
      const errorMsg = language === 'ko' ? '삭제 중 오류가 발생했습니다.' :
                       language === 'en' ? 'An error occurred while deleting.' :
                       language === 'ja' ? '削除中にエラーが発生しました。' :
                       '删除时发生错误。'
      alert(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* 배경 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* 모달 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-2xl border p-6 ${
              theme === 'dark'
                ? 'bg-gray-900 border-red-500/30'
                : 'bg-white border-red-300'
            }`}
          >
            {/* 닫기 버튼 */}
            {!isDeleting && (
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
            )}

            {/* 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            {/* 제목 */}
            <h2 className={`text-xl font-normal text-center mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {language === 'ko' && '모든 대화 기록 삭제'}
              {language === 'en' && 'Delete All Chat History'}
              {language === 'ja' && 'すべての会話履歴を削除'}
              {language === 'zh' && '删除所有对话记录'}
            </h2>

            {/* 경고 메시지 */}
            <div className={`mb-6 p-4 rounded-lg ${
              theme === 'dark'
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-red-300' : 'text-red-700'
              }`}>
                {language === 'ko' && (
                  <>
                    <strong>⚠️ 이 작업은 되돌릴 수 없습니다!</strong>
                    <br /><br />
                    • 모든 대화 기록이 영구적으로 삭제됩니다
                    <br />
                    • 심리 분석 결과가 모두 사라집니다
                    <br />
                    • 숲 레벨이 1로 초기화됩니다
                  </>
                )}
                {language === 'en' && (
                  <>
                    <strong>⚠️ This action cannot be undone!</strong>
                    <br /><br />
                    • All chat history will be permanently deleted
                    <br />
                    • All psychological analyses will be removed
                    <br />
                    • Forest level will be reset to 1
                  </>
                )}
                {language === 'ja' && (
                  <>
                    <strong>⚠️ この操作は元に戻せません！</strong>
                    <br /><br />
                    • すべての会話履歴が完全に削除されます
                    <br />
                    • すべての心理分析結果が削除されます
                    <br />
                    • 森のレベルが1にリセットされます
                  </>
                )}
                {language === 'zh' && (
                  <>
                    <strong>⚠️ 此操作无法撤消！</strong>
                    <br /><br />
                    • 所有对话记录将被永久删除
                    <br />
                    • 所有心理分析结果将被删除
                    <br />
                    • 森林等级将重置为1
                  </>
                )}
              </p>
            </div>

            {/* 확인 입력 */}
            <div className="mb-6">
              <label className={`block text-sm mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'ko' && '확인을 위해 "삭제"를 입력하세요:'}
                {language === 'en' && 'Type "DELETE" to confirm:'}
                {language === 'ja' && '確認のため「削除」と入力してください：'}
                {language === 'zh' && '输入"删除"以确认：'}
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isDeleting}
                placeholder={language === 'ko' ? '삭제' : language === 'en' ? 'DELETE' : language === 'ja' ? '削除' : '删除'}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                } focus:outline-none focus:border-red-500`}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {language === 'ko' && '취소'}
                {language === 'en' && 'Cancel'}
                {language === 'ja' && 'キャンセル'}
                {language === 'zh' && '取消'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={isDeleting || confirmText !== confirmWord}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  confirmText === confirmWord && !isDeleting
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-red-500/30 text-red-300 cursor-not-allowed'
                }`}
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {language === 'ko' && '삭제 중...'}
                    {language === 'en' && 'Deleting...'}
                    {language === 'ja' && '削除中...'}
                    {language === 'zh' && '删除中...'}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    {language === 'ko' && '삭제'}
                    {language === 'en' && 'Delete'}
                    {language === 'ja' && '削除'}
                    {language === 'zh' && '删除'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
