'use client'

import { useEffect } from 'react'

interface AdSenseProps {
  adSlot: string
  adFormat?: string
  fullWidthResponsive?: boolean
}

export default function AdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error('AdSense error:', error)
    }
  }, [])

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  if (!clientId) {
    return null // AdSense ID가 없으면 광고 표시 안 함
  }

  return (
    <div className="adsense-container my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  )
}
