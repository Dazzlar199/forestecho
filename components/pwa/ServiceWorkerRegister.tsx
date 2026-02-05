'use client'
import { logger } from '@/lib/utils/logger'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            logger.log('Service Worker 등록 성공:', registration.scope)
          })
          .catch((err) => {
            logger.log('Service Worker 등록 실패:', err)
          })
      })
    }
  }, [])

  return null
}
