'use client'

import Link from 'next/link'

export default function OfflineContent() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-3xl text-gray-100" style={{ fontWeight: 400, letterSpacing: '0.03em' }}>
          연결이 없어요
        </h1>
        <p className="text-gray-400" style={{ fontWeight: 300, lineHeight: 1.7 }}>
          현재 인터넷 연결이 불안정하거나 끊어진 것 같아요. 네트워크가 복구되면 숲울림의 모든 기능을 다시 이용하실 수 있어요.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-emerald-500/90 text-white hover:bg-emerald-500 transition-colors"
          style={{ fontWeight: 400, letterSpacing: '0.02em' }}
        >
          홈으로 돌아가기
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-full border border-white/20 text-gray-200 hover:bg-white/10 transition-colors"
          style={{ fontWeight: 300, letterSpacing: '0.02em' }}
        >
          다시 시도
        </button>
      </div>
    </main>
  )
}
