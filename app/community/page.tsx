'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { PenSquare, Filter } from 'lucide-react'
import PostCreate from '@/components/community/PostCreate'
import PostList from '@/components/community/PostList'
import PostDetail from '@/components/community/PostDetail'
import {
  CATEGORIES,
  MOCK_POSTS,
  MOCK_COMMENTS,
  type Post,
  type Comment,
  type PostCategory
} from '@/types/community'

export default function CommunityPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [showPostCreate, setShowPostCreate] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all')
  const currentUserId = 'test-user'

  useEffect(() => {
    // Mock data 초기화
    setPosts(MOCK_POSTS)
    setComments(MOCK_COMMENTS)
  }, [])

  const handleCreatePost = (postData: {
    category: PostCategory
    title: string
    content: string
    isAnonymous: boolean
    tags: string[]
  }) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUserId,
      authorName: '익명',
      isAnonymous: postData.isAnonymous,
      category: postData.category,
      title: postData.title,
      content: postData.content,
      timestamp: new Date(),
      likes: 0,
      commentCount: 0,
      likedBy: [],
      tags: postData.tags
    }

    setPosts([newPost, ...posts])
    setShowPostCreate(false)
  }

  const handlePostLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUserId)
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked
            ? post.likedBy.filter(id => id !== currentUserId)
            : [...post.likedBy, currentUserId]
        }
      }
      return post
    }))
  }

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const isLiked = comment.likedBy.includes(currentUserId)
        return {
          ...comment,
          likes: isLiked ? comment.likes - 1 : comment.likes + 1,
          likedBy: isLiked
            ? comment.likedBy.filter(id => id !== currentUserId)
            : [...comment.likedBy, currentUserId]
        }
      }
      return comment
    }))
  }

  const handleCommentSubmit = (content: string, isAnonymous: boolean) => {
    if (!selectedPostId) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: selectedPostId,
      authorId: currentUserId,
      authorName: '익명',
      isAnonymous,
      content,
      timestamp: new Date(),
      likes: 0,
      likedBy: []
    }

    setComments([...comments, newComment])

    // Update comment count
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) {
        return { ...post, commentCount: post.commentCount + 1 }
      }
      return post
    }))
  }

  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCategory)

  const selectedPost = selectedPostId ? posts.find(p => p.id === selectedPostId) : null
  const postComments = selectedPostId ? comments.filter(c => c.postId === selectedPostId) : []

  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-medium mb-6 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {language === 'ko' && '게시판'}
            {language === 'en' && 'Community Board'}
            {language === 'ja' && '掲示板'}
            {language === 'zh' && '社区板'}
          </h1>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPostCreate(true)}
              className={`px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <PenSquare className="w-4 h-4" />
              <span className="text-sm">
                {language === 'ko' && '글쓰기'}
                {language === 'en' && 'Write'}
                {language === 'ja' && '投稿'}
                {language === 'zh' && '写帖'}
              </span>
            </button>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as PostCategory | 'all')}
                className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors text-sm ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-gray-300'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
                style={{ outline: 'none' }}
              >
                <option value="all">
                  {language === 'ko' && '전체'}
                  {language === 'en' && 'All'}
                  {language === 'ja' && '全て'}
                  {language === 'zh' && '全部'}
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name[language as keyof typeof cat.name]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Post List */}
        <PostList
          posts={filteredPosts}
          onPostClick={setSelectedPostId}
          onLike={handlePostLike}
          currentUserId={currentUserId}
        />

        {/* Post Create Modal */}
        {showPostCreate && (
          <PostCreate
            onClose={() => setShowPostCreate(false)}
            onSubmit={handleCreatePost}
          />
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            comments={postComments}
            onClose={() => setSelectedPostId(null)}
            onLike={handlePostLike}
            onCommentLike={handleCommentLike}
            onCommentSubmit={handleCommentSubmit}
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  )
}
