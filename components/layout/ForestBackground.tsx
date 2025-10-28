'use client'

import { useState, useEffect } from 'react'

export default function ForestBackground() {
  const [mistIntensity, setMistIntensity] = useState(0)

  useEffect(() => {
    // 1분마다 안개 효과 토글
    const interval = setInterval(() => {
      setMistIntensity((prev) => (prev === 0 ? 1 : 0))
    }, 60000) // 60초

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div
        className="forest-mist"
        style={{
          opacity: mistIntensity === 1 ? 0.6 : 0.2,
          transition: 'opacity 15s ease-in-out'
        }}
      />
      <div className="forest-particles" />
      <div className="fireflies">
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
        <div className="firefly" />
      </div>
    </>
  )
}
