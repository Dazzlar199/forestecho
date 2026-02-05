'use client'
import { logger } from '@/lib/utils/logger'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserSubscription } from '@/lib/firebase/user-subscription'
import type { UserTier } from '@/types/user'

interface AuthContextType {
  user: User | null
  loading: boolean
  isPremium: boolean
  userTier: UserTier
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isPremium: false,
  userTier: 'guest',
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)
  const [userTier, setUserTier] = useState<UserTier>('guest')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          // Firestore에서 user subscription 가져오기
          const subscription = await getUserSubscription(user.uid)
          setUserTier(subscription.tier)
          setIsPremium(subscription.tier === 'premium')
        } catch (error) {
          logger.error('Failed to fetch user subscription:', error)
          setUserTier('free')
          setIsPremium(false)
        }
      } else {
        setUserTier('guest')
        setIsPremium(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isPremium, userTier }}>
      {children}
    </AuthContext.Provider>
  )
}
