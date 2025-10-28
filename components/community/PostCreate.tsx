'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { X, Coffee, Cloud, TrendingUp, Heart, HelpCircle, Sparkles, UserCircle } from 'lucide-react'
import { CATEGORIES, type PostCategory } from '@/types/community'

const iconMap: Record<string, any> = {
  Coffee,
  Cloud,
  TrendingUp,
  Heart,
  HelpCircle,
  Sparkles
}

interface PostCreateProps {
  onClose: () => void
  onSubmit: (post: {
    category: PostCategory
    title: string
    content: string
    isAnonymous: boolean
    tags: string[]
  }) => void
}

export default function PostCreate({ onClose, onSubmit }: PostCreateProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [category, setCategory] = useState<PostCategory>('daily')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return

    onSubmit({
      category,
      title: title.trim(),
      content: content.trim(),
      isAnonymous,
      tags
    })

    // Reset
    setTitle('')
    setContent('')
    setTags([])
    setTagInput('')
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const canSubmit = title.trim().length > 0 && content.trim().length > 0

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
      theme === 'dark' ? 'bg-black/80' : 'bg-black/60'
    }`} onClick={onClose}>
      <div className={`backdrop-blur-xl border rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark'
          ? 'bg-black/90 border-white/10'
          : 'bg-white/95 border-gray-700/20'
      }`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-light ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.05em' }}>
            {language === 'ko' && '글쓰기'}
            {language === 'en' && 'Write a Post'}
            {language === 'ja' && '投稿を書く'}
            {language === 'zh' && '写帖子'}
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

        {/* Anonymous Toggle */}
        <div className={`mb-6 p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className="flex items-center gap-3 w-full"
          >
            <div className={`w-12 h-6 rounded-full transition-colors relative ${
              isAnonymous ? 'bg-emerald-500' : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isAnonymous ? 'translate-x-6' : ''
              }`} />
            </div>
            <div className="flex items-center gap-2">
              <UserCircle className="w-5 h-5" />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {language === 'ko' && '익명으로 작성'}
                {language === 'en' && 'Post anonymously'}
                {language === 'ja' && '匿名で投稿'}
                {language === 'zh' && '匿名发布'}
              </span>
            </div>
          </button>
          {isAnonymous && (
            <p className={`mt-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              {language === 'ko' && '작성자가 "익명"으로 표시됩니다'}
              {language === 'en' && 'Author will be shown as "익명"'}
              {language === 'ja' && '投稿者は「익명」と表示されます'}
              {language === 'zh' && '作者将显示为"익명"'}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className={`block text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '카테고리'}
            {language === 'en' && 'Category'}
            {language === 'ja' && 'カテゴリー'}
            {language === 'zh' && '类别'}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon]
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? `border-[${cat.color}]`
                      : theme === 'dark'
                        ? 'border-white/10 hover:border-white/30'
                        : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    borderColor: isSelected ? cat.color : undefined,
                    backgroundColor: isSelected ? `${cat.color}15` : undefined
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon className="w-4 h-4" style={{ color: cat.color }} />}
                    <span className={`text-sm font-medium ${
                      isSelected
                        ? theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {cat.name[language as keyof typeof cat.name]}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {cat.description[language as keyof typeof cat.description]}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className={`block text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '제목'}
            {language === 'en' && 'Title'}
            {language === 'ja' && 'タイトル'}
            {language === 'zh' && '标题'}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              language === 'ko' ? '제목을 입력하세요' :
              language === 'en' ? 'Enter title' :
              language === 'ja' ? 'タイトルを入力' :
              '输入标题'
            }
            maxLength={100}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-emerald-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-emerald-600'
            }`}
            style={{ outline: 'none' }}
          />
          <p className={`mt-1 text-xs text-right ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {title.length} / 100
          </p>
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className={`block text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '내용'}
            {language === 'en' && 'Content'}
            {language === 'ja' && '内容'}
            {language === 'zh' && '内容'}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              language === 'ko' ? '내용을 입력하세요' :
              language === 'en' ? 'Write your content...' :
              language === 'ja' ? '内容を入力...' :
              '输入内容...'
            }
            maxLength={2000}
            rows={10}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
              theme === 'dark'
                ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-emerald-500'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-emerald-600'
            }`}
            style={{ outline: 'none' }}
          />
          <p className={`mt-1 text-xs text-right ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {content.length} / 2000
          </p>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <label className={`block text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {language === 'ko' && '태그 (선택)'}
            {language === 'en' && 'Tags (optional)'}
            {language === 'ja' && 'タグ (任意)'}
            {language === 'zh' && '标签 (可选)'}
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder={
                language === 'ko' ? '태그 입력 후 Enter' :
                language === 'en' ? 'Enter tag and press Enter' :
                language === 'ja' ? 'タグを入力してEnter' :
                '输入标签并按Enter'
              }
              maxLength={20}
              disabled={tags.length >= 5}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-emerald-500'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-emerald-600'
              } disabled:opacity-50`}
              style={{ outline: 'none' }}
            />
            <button
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 5}
              className={`px-6 py-2 rounded-lg transition-colors ${
                tagInput.trim() && tags.length < 5
                  ? theme === 'dark'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {language === 'ko' && '추가'}
              {language === 'en' && 'Add'}
              {language === 'ja' && '追加'}
              {language === 'zh' && '添加'}
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleRemoveTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  #{tag}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-gray-400'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {language === 'ko' && '취소'}
            {language === 'en' && 'Cancel'}
            {language === 'ja' && 'キャンセル'}
            {language === 'zh' && '取消'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 px-6 py-3 rounded-lg transition-all ${
              canSubmit
                ? theme === 'dark'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {language === 'ko' && '게시하기'}
            {language === 'en' && 'Post'}
            {language === 'ja' && '投稿'}
            {language === 'zh' && '发布'}
          </button>
        </div>
      </div>
    </div>
  )
}
