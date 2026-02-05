'use client'
import { logger } from '@/lib/utils/logger'

import { useState } from 'react'
import { Share2, Download, MessageCircle } from 'lucide-react'
import html2canvas from 'html2canvas'
import { useLanguage } from '@/components/layout/LanguageProvider'

interface ShareProgressProps {
  title: string
  description: string
  targetRef: React.RefObject<HTMLDivElement | null>
}

export function ShareProgress({ title, description, targetRef }: ShareProgressProps) {
  const { language } = useLanguage()
  const [sharing, setSharing] = useState(false)

  async function captureAndShare() {
    if (!targetRef.current) return

    setSharing(true)
    try {
      const canvas = await html2canvas(targetRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
      })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharing(false)
          return
        }

        const file = new File([blob], 'my-progress.png', { type: 'image/png' })

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title,
              text: description,
              files: [file],
            })
          } catch (error) {
            if ((error as Error).name !== 'AbortError') {
              logger.error('Share failed:', error)
              downloadImage(canvas)
            }
          }
        } else {
          // Fallback: download image
          downloadImage(canvas)
        }

        setSharing(false)
      })
    } catch (error) {
      logger.error('Failed to capture image:', error)
      setSharing(false)
    }
  }

  function downloadImage(canvas: HTMLCanvasElement) {
    const link = document.createElement('a')
    link.download = 'forestecho-progress.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  function shareToKakao() {
    if (typeof window === 'undefined' || !(window as any).Kakao) {
      const errorMsg = language === 'ko' ? '카카오톡 공유 기능을 사용할 수 없습니다.' :
                       language === 'en' ? 'KakaoTalk sharing is not available.' :
                       language === 'ja' ? 'カカオトーク共有機能が利用できません。' :
                       'KakaoTalk分享功能不可用。'
      alert(errorMsg)
      return
    }

    const kakao = (window as any).Kakao

    if (!kakao.isInitialized()) {
      // Initialize with your Kakao JavaScript key
      // kakao.init('YOUR_KAKAO_JS_KEY')
      const errorMsg = language === 'ko' ? '카카오톡 API 키가 설정되지 않았습니다.' :
                       language === 'en' ? 'KakaoTalk API key is not configured.' :
                       language === 'ja' ? 'カカオトークAPIキーが設定されていません。' :
                       'KakaoTalk API密钥未配置。'
      alert(errorMsg)
      return
    }

    const buttonTitle = language === 'ko' ? '앱에서 보기' :
                        language === 'en' ? 'View in app' :
                        language === 'ja' ? 'アプリで見る' :
                        '在应用中查看'

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: title,
        description: description,
        imageUrl: window.location.origin + '/og-image.png',
        link: {
          mobileWebUrl: window.location.origin,
          webUrl: window.location.origin,
        },
      },
      buttons: [
        {
          title: buttonTitle,
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    })
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={captureAndShare}
        disabled={sharing}
        className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        title={
          language === 'ko' ? '이미지로 공유' :
          language === 'en' ? 'Share as image' :
          language === 'ja' ? '画像として共有' :
          '以图片形式分享'
        }
      >
        {sharing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {language === 'ko' && '생성 중...'}
            {language === 'en' && 'Generating...'}
            {language === 'ja' && '生成中...'}
            {language === 'zh' && '生成中...'}
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            {language === 'ko' && '공유하기'}
            {language === 'en' && 'Share'}
            {language === 'ja' && '共有'}
            {language === 'zh' && '分享'}
          </>
        )}
      </button>

      <button
        onClick={shareToKakao}
        className="p-2.5 bg-yellow-400 hover:bg-yellow-500 rounded-lg transition-colors"
        title={
          language === 'ko' ? '카카오톡 공유' :
          language === 'en' ? 'Share to KakaoTalk' :
          language === 'ja' ? 'カカオトークで共有' :
          '分享到KakaoTalk'
        }
      >
        <MessageCircle className="w-5 h-5 text-gray-800" />
      </button>
    </div>
  )
}
