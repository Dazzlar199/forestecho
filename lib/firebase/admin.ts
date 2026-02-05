import admin from 'firebase-admin'
import { logger } from '@/lib/utils/logger'

let initialized = false

function initAdmin() {
  if (initialized || admin.apps.length > 0) {
    return
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined

  if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    logger.warn('[Firebase Admin] Missing environment variables:', {
      hasPrivateKey: !!privateKey,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    })
    throw new Error('Firebase Admin SDK environment variables are not configured')
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })
    initialized = true
    logger.log('[Firebase Admin] Successfully initialized')
  } catch (error: any) {
    logger.error('[Firebase Admin] Initialization failed:', error.message)
    throw error
  }
}

export const adminDb = new Proxy({} as ReturnType<typeof admin.firestore>, {
  get(target, prop) {
    initAdmin()
    const db = admin.firestore()
    const value = (db as any)[prop]
    return typeof value === 'function' ? value.bind(db) : value
  }
})

export const adminAuth = new Proxy({} as ReturnType<typeof admin.auth>, {
  get(target, prop) {
    initAdmin()
    const auth = admin.auth()
    const value = (auth as any)[prop]
    return typeof value === 'function' ? value.bind(auth) : value
  }
})
