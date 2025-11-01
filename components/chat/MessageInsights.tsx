'use client'

import type { MessageMetadata } from '@/types'

interface MessageInsightsProps {
  metadata: MessageMetadata
}

// 오른쪽 사이드바(LiveAnalysisSidebar)에 표시되므로 메시지 아래에는 표시하지 않음
export default function MessageInsights({ metadata }: MessageInsightsProps) {
  return null
}
