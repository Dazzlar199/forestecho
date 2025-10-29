import { Loader2, Heart } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-12 h-12 text-rose-500 mx-auto mb-2 animate-pulse" />
        <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">감정 일기 로딩 중...</p>
      </div>
    </div>
  )
}
