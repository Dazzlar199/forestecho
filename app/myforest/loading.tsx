import { Loader2, TreePine } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <TreePine className="w-12 h-12 text-emerald-500 mx-auto mb-2 animate-pulse" />
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">나의 숲 불러오는 중...</p>
      </div>
    </div>
  )
}
