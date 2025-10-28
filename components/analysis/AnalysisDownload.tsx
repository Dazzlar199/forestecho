'use client'

import { useState } from 'react'
import { Download, FileImage, FileText, Loader2 } from 'lucide-react'

interface AnalysisDownloadProps {
  analysisId: string
  title?: string
}

export default function AnalysisDownload({ analysisId, title = '심리분석결과' }: AnalysisDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const downloadAsImage = async () => {
    setIsDownloading(true)
    try {
      // html2canvas를 동적으로 import
      const html2canvas = (await import('html2canvas')).default

      // 분석 결과 영역 캡처
      const element = document.getElementById('analysis-content')
      if (!element) {
        throw new Error('Analysis content not found')
      }

      // 캡처 전 스크롤을 맨 위로
      window.scrollTo(0, 0)

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
      })

      // 이미지로 변환
      const image = canvas.toDataURL('image/png')

      // 다운로드
      const link = document.createElement('a')
      link.href = image
      link.download = `${title}_${new Date().toISOString().split('T')[0]}.png`
      link.click()
    } catch (error) {
      console.error('Image download failed:', error)
      alert('이미지 다운로드에 실패했습니다.')
    } finally {
      setIsDownloading(false)
      setShowMenu(false)
    }
  }

  const downloadAsText = () => {
    try {
      // 분석 결과 텍스트 추출
      const element = document.getElementById('analysis-content')
      if (!element) {
        throw new Error('Analysis content not found')
      }

      const text = element.innerText
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `${title}_${new Date().toISOString().split('T')[0]}.txt`
      link.click()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Text download failed:', error)
      alert('텍스트 다운로드에 실패했습니다.')
    } finally {
      setShowMenu(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isDownloading}
        className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/15 text-gray-300 hover:bg-white/10 transition-all disabled:opacity-50"
        style={{ fontWeight: 300, letterSpacing: '0.05em' }}
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            다운로드 중...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            다운로드
          </>
        )}
      </button>

      {showMenu && !isDownloading && (
        <>
          {/* 배경 클릭 시 닫기 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* 메뉴 */}
          <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden z-50 min-w-[200px]">
            <button
              onClick={downloadAsImage}
              className="w-full px-6 py-3 text-left text-sm text-gray-300 hover:bg-white/10 transition-all flex items-center gap-3"
              style={{ fontWeight: 300, letterSpacing: '0.05em' }}
            >
              <FileImage className="w-4 h-4 text-blue-400" />
              이미지로 저장 (PNG)
            </button>
            <button
              onClick={downloadAsText}
              className="w-full px-6 py-3 text-left text-sm text-gray-300 hover:bg-white/10 transition-all flex items-center gap-3"
              style={{ fontWeight: 300, letterSpacing: '0.05em' }}
            >
              <FileText className="w-4 h-4 text-green-400" />
              텍스트로 저장 (TXT)
            </button>
          </div>
        </>
      )}
    </div>
  )
}
