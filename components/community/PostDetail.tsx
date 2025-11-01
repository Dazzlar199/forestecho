'use client'

import { useState } from 'react'
import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { X, Heart, MessageCircle, Clock, Send } from 'lucide-react'
import { CATEGORIES, type Post, type Comment } from '@/types/community'
import { iconMap } from '@/lib/utils/icon-map'

interface PostDetailProps {
  post: Post
  comments: Comment[]
  onClose: () => void
  onLike: (postId: string) => void
  onCommentLike: (commentId: string) => void
  onCommentSubmit: (content: string, isAnonymous: boolean) => void
  currentUserId?: string
}

export default function PostDetail({
  post,
  comments,
  onClose,
  onLike,
  onCommentLike,
  onCommentSubmit,
  currentUserId
}: PostDetailProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [commentText, setCommentText] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)

  const category = CATEGORIES.find(c => c.id === post.category)
  const Icon = category ? iconMap[category.icon] : iconMap['Coffee']
  const isPostLiked = currentUserId && post.likedBy.includes(currentUserId)

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) {
      return language === 'ko' ? '방금 전' :
             language === 'en' ? 'Just now' :
             language === 'ja' ? 'たった今' : '刚刚'
    } else if (diffMins < 60) {
      return language === 'ko' ? `${diffMins}분 전` :
             language === 'en' ? `${diffMins}m ago` :
             language === 'ja' ? `${diffMins}分前` : `${diffMins}分钟前`
    } else if (diffHours < 24) {
      return language === 'ko' ? `${diffHours}시간 전` :
             language === 'en' ? `${diffHours}h ago` :
             language === 'ja' ? `${diffHours}時間前` : `${diffHours}小时前`
    } else {
      return language === 'ko' ? `${diffDays}일 전` :
             language === 'en' ? `${diffDays}d ago` :
             language === 'ja' ? `${diffDays}日前` : `${diffDays}天前`
    }
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return
    onCommentSubmit(commentText.trim(), isAnonymous)
    setCommentText('')
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
      theme === 'dark' ? 'bg-black/80' : 'bg-black/60'
    }`} onClick={onClose}>
      <div className={`backdrop-blur-xl border rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark'
          ? 'bg-black/90 border-white/10'
          : 'bg-white/95 border-gray-700/20'
      }`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {category && (
              <div
                className="px-4 py-2 rounded-full flex items-center gap-2"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {category.name[language as keyof typeof category.name]}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200/50'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Content */}
        <div className={`mb-6 pb-6 border-b ${
          theme === 'dark' ? 'border-white/10' : 'border-gray-200'
        }`}>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {post.authorName}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3" />
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                {formatTimeAgo(post.timestamp)}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl font-light mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`} style={{ letterSpacing: '0.03em', lineHeight: 1.4 }}>
            {post.title}
          </h1>

          {/* Content */}
          <div className={`text-base mb-4 whitespace-pre-wrap ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`} style={{ lineHeight: 1.8 }}>
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-3 py-1 rounded-full ${
                    theme === 'dark'
                      ? 'bg-white/10 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-2 transition-colors ${
                isPostLiked
                  ? 'text-pink-500'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={isPostLiked ? 'currentColor' : 'none'}
              />
              <span className="text-sm">{post.likes}</span>
            </button>

            <div className={`flex items-center gap-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{comments.length}</span>
            </div>
          </div>
        </div>

        {/* Comment Input */}
        <div className={`mb-6 p-4 rounded-lg border ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          {/* Anonymous Toggle */}
          <div className="mb-3">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="flex items-center gap-2 text-xs"
            >
              <div className={`w-8 h-4 rounded-full transition-colors relative ${
                isAnonymous ? 'bg-emerald-500' : theme === 'dark' ? 'bg-white/20' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${
                  isAnonymous ? 'translate-x-4' : ''
                }`} />
              </div>
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {language === 'ko' && '익명'}
                {language === 'en' && 'Anonymous'}
                {language === 'ja' && '匿名'}
                {language === 'zh' && '匿名'}
              </span>
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                language === 'ko' ? '댓글을 남겨보세요' :
                language === 'en' ? 'Write a comment...' :
                language === 'ja' ? 'コメントを書く...' :
                '写评论...'
              }
              rows={3}
              maxLength={500}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-colors resize-none ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-emerald-500'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-emerald-600'
              }`}
              style={{ outline: 'none' }}
            />
            <button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
                commentText.trim()
                  ? theme === 'dark'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className={`mt-1 text-xs text-right ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {commentText.length} / 500
          </p>
        </div>

        {/* Comments */}
        <div>
          <h3 className={`text-lg font-medium mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {language === 'ko' && `댓글 ${comments.length}개`}
            {language === 'en' && `${comments.length} Comments`}
            {language === 'ja' && `コメント ${comments.length}件`}
            {language === 'zh' && `${comments.length} 条评论`}
          </h3>

          <div className="space-y-4">
            {comments.map((comment) => {
              const isCommentLiked = currentUserId && comment.likedBy.includes(currentUserId)
              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Comment Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {comment.authorName}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <p className={`text-sm mb-3 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} style={{ lineHeight: 1.6 }}>
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <button
                    onClick={() => onCommentLike(comment.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      isCommentLiked
                        ? 'text-pink-500'
                        : theme === 'dark'
                          ? 'text-gray-500 hover:text-gray-400'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isCommentLiked ? 'currentColor' : 'none'}
                    />
                    <span className="text-xs">{comment.likes}</span>
                  </button>
                </div>
              )
            })}

            {comments.length === 0 && (
              <p className={`text-center py-8 text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {language === 'ko' && '아직 댓글이 없습니다'}
                {language === 'en' && 'No comments yet'}
                {language === 'ja' && 'まだコメントがありません'}
                {language === 'zh' && '还没有评论'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
