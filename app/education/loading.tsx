import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">심리교육 콘텐츠 로딩 중...</p>
      </div>
    </div>
  )
}
