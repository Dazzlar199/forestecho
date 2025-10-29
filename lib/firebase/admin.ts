import admin from 'firebase-admin'

// Only initialize if not already initialized and credentials are available
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined

  // Skip initialization during build if credentials are missing
  if (privateKey && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      })
    } catch (error) {
      // Silently fail during build - will work at runtime
      console.error('[Firebase Admin] Initialization skipped:', error)
    }
  }
}

export const adminDb = admin.firestore()
export const adminAuth = admin.auth()
