'use client'

import { useEffect } from 'react'

interface AdSenseAdProps {
  adSlot: string
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  fullWidthResponsive?: boolean
  style?: React.CSSProperties
}

export default function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
}: AdSenseAdProps) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (adsenseClientId && typeof window !== 'undefined') {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || []
        ;((window as any).adsbygoogle).push({})
      } catch (error) {
        console.error('AdSense error:', error)
      }
    }
  }, [adsenseClientId])

  if (!adsenseClientId) {
    return (
      <div
        className="p-4 bg-white/5 rounded-lg border border-white/10 text-center"
        style={style}
      >
        <p className="text-gray-500 text-sm">
          Ad Space
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Will be activated after AdSense approval
        </p>
      </div>
    )
  }

  return (
    <div style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  )
}
