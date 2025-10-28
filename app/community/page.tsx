'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/components/layout/LanguageProvider'
import { useTheme } from '@/components/layout/ThemeProvider'
import { useAuth } from '@/components/layout/AuthProvider'
import { PenSquare, Filter } from 'lucide-react'
import PostCreate from '@/components/community/PostCreate'
import PostList from '@/components/community/PostList'
import PostDetail from '@/components/community/PostDetail'
import {
  CATEGORIES,
  type Post,
  type Comment,
  type PostCategory
} from '@/types/community'
import { db } from '@/lib/firebase/config'
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  updateDoc,
  doc,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'

export default function CommunityPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [showPostCreate, setShowPostCreate] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | 'all'>('all')

  // 게시글 불러오기
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Post[]
      setPosts(postsData)
    })

    return () => unsubscribe()
  }, [])

  // 댓글 불러오기
  useEffect(() => {
    if (!selectedPostId) return

    const q = query(
      collection(db, 'posts', selectedPostId, 'comments'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as Comment[]
      setComments(commentsData)
    })

    return () => unsubscribe()
  }, [selectedPostId])

  const handleCreatePost = async (postData: {
    category: PostCategory
    title: string
    content: string
    isAnonymous: boolean
    tags: string[]
  }) => {
    if (!user) return

    try {
      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: postData.isAnonymous ? '익명' : user.displayName || '사용자',
        isAnonymous: postData.isAnonymous,
        category: postData.category,
        title: postData.title,
        content: postData.content,
        timestamp: new Date(),
        likes: 0,
        commentCount: 0,
        likedBy: [],
        tags: postData.tags,
      })

      setShowPostCreate(false)
    } catch (error) {
      console.error('게시글 작성 오류:', error)
      alert('게시글 작성 중 오류가 발생했습니다.')
    }
  }

  const handlePostLike = async (postId: string) => {
    if (!user) return

    try {
      const post = posts.find((p) => p.id === postId)
      if (!post) return

      const isLiked = post.likedBy.includes(user.uid)
      const postRef = doc(db, 'posts', postId)

      await updateDoc(postRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
    } catch (error) {
      console.error('좋아요 오류:', error)
    }
  }

  const handleCommentLike = async (commentId: string) => {
    if (!user || !selectedPostId) return

    try {
      const comment = comments.find((c) => c.id === commentId)
      if (!comment) return

      const isLiked = comment.likedBy.includes(user.uid)
      const commentRef = doc(db, 'posts', selectedPostId, 'comments', commentId)

      await updateDoc(commentRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      })
    } catch (error) {
      console.error('댓글 좋아요 오류:', error)
    }
  }

  const handleCommentSubmit = async (content: string, isAnonymous: boolean) => {
    if (!selectedPostId || !user) return

    try {
      await addDoc(collection(db, 'posts', selectedPostId, 'comments'), {
        postId: selectedPostId,
        authorId: user.uid,
        authorName: isAnonymous ? '익명' : user.displayName || '사용자',
        isAnonymous,
        content,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
      })

      // 댓글 수 증가
      const postRef = doc(db, 'posts', selectedPostId)
      await updateDoc(postRef, {
        commentCount: increment(1),
      })
    } catch (error) {
      console.error('댓글 작성 오류:', error)
      alert('댓글 작성 중 오류가 발생했습니다.')
    }
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
          currentUserId={user?.uid || ''}
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
            currentUserId={user?.uid || ''}
          />
        )}
      </div>
    </div>
  )
}
