import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { ChatSession, ChatSessionCreate } from '@/types/chat'
import type { Message } from '@/types'
import { logger } from '@/lib/utils/logger'

// Firestore 데이터를 ChatSession으로 변환
function convertFirestoreToSession(id: string, data: any): ChatSession {
  return {
    id,
    userId: data.userId,
    title: data.title,
    messages: data.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp?.toDate() || new Date(),
    })),
    counselingMode: data.counselingMode,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

// 타임아웃 래퍼 함수
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timeout')), timeoutMs)
    ),
  ])
}

// 새 대화 세션 생성
export async function createChatSession(
  sessionData: ChatSessionCreate
): Promise<string> {
  try {
    const docRef = await withTimeout(
      addDoc(collection(db, 'chatSessions'), {
        ...sessionData,
        messages: sessionData.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: Timestamp.fromDate(msg.timestamp),
        })),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
      5000
    )
    return docRef.id
  } catch (error) {
    logger.error('Error creating chat session:', error)
    throw error
  }
}

// 대화 세션 업데이트
export async function updateChatSession(
  sessionId: string,
  messages: Message[],
  title?: string
): Promise<void> {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId)
    const updateData: any = {
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: Timestamp.fromDate(msg.timestamp),
      })),
      updatedAt: serverTimestamp(),
    }

    if (title) {
      updateData.title = title
    }

    await withTimeout(updateDoc(sessionRef, updateData), 5000)
  } catch (error) {
    logger.error('Error updating chat session:', error)
    throw error
  }
}

// 사용자의 모든 대화 세션 불러오기
export async function getUserChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const q = query(
      collection(db, 'chatSessions'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )

    const querySnapshot = await withTimeout(getDocs(q), 10000)
    const sessions: ChatSession[] = []

    querySnapshot.forEach((doc) => {
      sessions.push(convertFirestoreToSession(doc.id, doc.data()))
    })

    return sessions
  } catch (error) {
    logger.error('Error getting user chat sessions:', error)
    throw error
  }
}

// 특정 대화 세션 불러오기
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  try {
    const sessionRef = doc(db, 'chatSessions', sessionId)
    const sessionSnap = await withTimeout(getDoc(sessionRef), 5000)

    if (sessionSnap.exists()) {
      return convertFirestoreToSession(sessionSnap.id, sessionSnap.data())
    }
    return null
  } catch (error) {
    logger.error('Error getting chat session:', error)
    throw error
  }
}

// 대화 세션 삭제
export async function deleteChatSession(sessionId: string): Promise<void> {
  try {
    await withTimeout(deleteDoc(doc(db, 'chatSessions', sessionId)), 5000)
  } catch (error) {
    logger.error('Error deleting chat session:', error)
    throw error
  }
}

// 대화 제목 자동 생성 (첫 사용자 메시지의 앞부분 사용)
export function generateChatTitle(messages: Message[]): string {
  const firstUserMessage = messages.find((msg) => msg.role === 'user')
  if (firstUserMessage) {
    const content = firstUserMessage.content.trim()
    return content.length > 30 ? content.substring(0, 30) + '...' : content
  }
  return '새로운 대화'
}
