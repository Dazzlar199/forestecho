'use client'

import { useLanguage } from '../layout/LanguageProvider'
import { useTheme } from '../layout/ThemeProvider'
import { Heart, MessageCircle, Clock } from 'lucide-react'
import { CATEGORIES, type Post } from '@/types/community'

interface PostListProps {
  posts: Post[]
  onPostClick: (postId: string) => void
  onLike: (postId: string) => void
  currentUserId?: string
}

export default function PostList({ posts, onPostClick, onLike, currentUserId }: PostListProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) {
      return language === 'ko' ? '방금' :
             language === 'en' ? 'now' :
             language === 'ja' ? '今' : '刚刚'
    } else if (diffMins < 60) {
      return `${diffMins}${language === 'ko' ? '분' : language === 'en' ? 'm' : language === 'ja' ? '分' : '分'}`
    } else if (diffHours < 24) {
      return `${diffHours}${language === 'ko' ? '시간' : language === 'en' ? 'h' : language === 'ja' ? '時間' : '小时'}`
    } else {
      return `${diffDays}${language === 'ko' ? '일' : language === 'en' ? 'd' : language === 'ja' ? '日' : '天'}`
    }
  }

  if (posts.length === 0) {
    return (
      <div className={`text-center py-20 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <p className="text-sm">
          {language === 'ko' && '게시글이 없습니다'}
          {language === 'en' && 'No posts'}
          {language === 'ja' && '投稿がありません'}
          {language === 'zh' && '没有帖子'}
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${
      theme === 'dark'
        ? 'bg-black/40 border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      {posts.map((post, index) => {
        const category = CATEGORIES.find(c => c.id === post.category)
        const isLiked = currentUserId && post.likedBy.includes(currentUserId)

        return (
          <div
            key={post.id}
            className={`${
              index !== 0 ? theme === 'dark' ? 'border-t border-white/10' : 'border-t border-gray-200' : ''
            }`}
          >
            <div
              onClick={() => onPostClick(post.id)}
              className={`px-6 py-4 cursor-pointer transition-colors ${
                theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {/* Category */}
                    {category && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          theme === 'dark' ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {category.name[language as keyof typeof category.name]}
                      </span>
                    )}
                    {/* Tags */}
                    {post.tags && post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-medium mb-1 truncate ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    {post.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      {post.authorName}
                    </span>
                    <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>
                      {formatTimeAgo(post.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onLike(post.id)
                    }}
                    className={`flex items-center gap-1 transition-colors ${
                      isLiked
                        ? 'text-pink-500'
                        : theme === 'dark'
                          ? 'text-gray-500 hover:text-gray-400'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isLiked ? 'currentColor' : 'none'}
                    />
                    <span>{post.likes}</span>
                  </button>

                  <div className={`flex items-center gap-1 ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
