import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

export interface ChatSession {
  id?: string
  userId: string
  title: string
  messages: {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

// 새 채팅 세션 생성
export async function createChatSession(userId: string, firstMessage: string) {
  const session: Omit<ChatSession, 'id'> = {
    userId,
    title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const docRef = await addDoc(collection(db, 'chatSessions'), {
    ...session,
    createdAt: Timestamp.fromDate(session.createdAt),
    updatedAt: Timestamp.fromDate(session.updatedAt),
  })

  return { ...session, id: docRef.id }
}

// 채팅 세션에 메시지 추가
export async function addMessageToSession(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
) {
  const sessionRef = doc(db, 'chatSessions', sessionId)

  await updateDoc(sessionRef, {
    messages: [
      ...(await getDocs(query(collection(db, 'chatSessions'), where('__name__', '==', sessionId)))).docs[0]?.data()?.messages || [],
      {
        role,
        content,
        timestamp: Timestamp.now(),
      },
    ],
    updatedAt: Timestamp.now(),
  })
}

// 사용자의 채팅 세션 목록 가져오기
export async function getUserChatSessions(userId: string, limitCount: number = 20) {
  const q = query(
    collection(db, 'chatSessions'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  )

  const querySnapshot = await getDocs(q)
  const sessions: ChatSession[] = []

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    sessions.push({
      id: doc.id,
      userId: data.userId,
      title: data.title,
      messages: data.messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toDate(),
      })),
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    })
  })

  return sessions
}

// 사용자 프로필 (프리미엄 상태 등)
export interface UserProfile {
  userId: string
  email: string
  displayName: string
  isPremium: boolean
  premiumUntil?: Date
  createdAt: Date
}

// 사용자 프로필 생성/업데이트
export async function updateUserProfile(profile: UserProfile) {
  const userRef = doc(db, 'users', profile.userId)

  await updateDoc(userRef, {
    ...profile,
    createdAt: Timestamp.fromDate(profile.createdAt),
    premiumUntil: profile.premiumUntil ? Timestamp.fromDate(profile.premiumUntil) : null,
  })
}
