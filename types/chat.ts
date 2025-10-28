import type { Message } from './index'
import type { CounselingMode } from '@/lib/openai/counseling-modes'

export interface ChatSession {
  id: string
  userId: string
  title: string
  messages: Message[]
  counselingMode: CounselingMode
  createdAt: Date
  updatedAt: Date
}

export interface ChatSessionCreate {
  userId: string
  title: string
  messages: Message[]
  counselingMode: CounselingMode
}
