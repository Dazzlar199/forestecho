'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import SkeletonLoader from '../loading/SkeletonLoader'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!imgRef.current || priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // 50px 전에 미리 로드
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [priority])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0">
          <SkeletonLoader variant="card" />
        </div>
      )}

      {/* Actual image - only load when in view or priority */}
      {(isInView || priority) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            onLoad={() => setIsLoaded(true)}
            className={className}
            loading={priority ? 'eager' : 'lazy'}
          />
        </motion.div>
      )}
    </div>
  )
}
