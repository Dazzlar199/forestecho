import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  return NextResponse.json({
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey?.length,
    startsWithQuote: privateKey?.startsWith('"'),
    endsWithQuote: privateKey?.endsWith('"'),
    startsWithBegin: privateKey?.startsWith('-----BEGIN'),
    privateKeyFirst50: privateKey?.substring(0, 50),
    privateKeyLast50: privateKey?.substring(privateKey.length - 50),
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  })
}
