import admin from 'firebase-admin'

let initialized = false

function initAdmin() {
  if (initialized || admin.apps.length > 0) {
    return
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined

  if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    return
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
  } catch (error) {
    // Ignore errors during build
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
