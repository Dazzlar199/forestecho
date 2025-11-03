'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker 등록 성공:', registration.scope)
          })
          .catch((err) => {
            console.log('Service Worker 등록 실패:', err)
          })
      })
    }
  }, [])

  return null
}
