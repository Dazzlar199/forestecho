'use client'

import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause, SkipForward } from 'lucide-react'

const MUSIC_TRACKS = [
  { title: '숲의 속삭임', file: '/music/forest-whispers.mp3' },
  { title: '황금빛 꿈', file: '/music/golden-hour-dreams.mp3' },
  { title: '치유의 빗소리', file: '/music/healing-rain-therapy.mp3' },
  { title: '바다의 환상', file: '/music/ocean-reverie.mp3' },
  { title: '별빛 명상', file: '/music/starlit-reverie.mp3' },
  { title: '무중력 꿈', file: '/music/weightless-dreams.mp3' },
]

export default function BGMPlayer() {
  const [isPlaying, setIsPlaying] = useState(true) // 기본으로 켜짐
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // 컴포넌트 마운트 시 랜덤 트랙 선택
  useEffect(() => {
    setCurrentTrackIndex(Math.floor(Math.random() * MUSIC_TRACKS.length))
  }, [])

  // 컴포넌트 마운트 시 자동 재생
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // 자동재생 실패 시 (브라우저 정책)
        setIsPlaying(false)
      })
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const nextTrack = () => {
    // 랜덤으로 다음 곡 선택 (현재 곡 제외)
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * MUSIC_TRACKS.length)
    } while (newIndex === currentTrackIndex && MUSIC_TRACKS.length > 1)

    setCurrentTrackIndex(newIndex)
    setIsPlaying(true)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play()
    }
  }, [currentTrackIndex])

  return (
    <div
      className="fixed bottom-8 right-8 z-40"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <audio
        ref={audioRef}
        src={MUSIC_TRACKS[currentTrackIndex].file}
        loop={false}
        onEnded={nextTrack}
      />

      {/* Compact Button */}
      {!showControls && (
        <button
          onClick={togglePlay}
          className="w-14 h-14 bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all duration-300 shadow-2xl"
          style={{ borderRadius: '2px' }}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-gray-300" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      )}

      {/* Expanded Controls */}
      {showControls && (
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl" style={{ borderRadius: '2px', minWidth: '280px' }}>
          {/* Track Info */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1" style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
              NOW PLAYING
            </p>
            <p className="text-sm text-gray-300" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
              {MUSIC_TRACKS[currentTrackIndex].title}
            </p>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ borderRadius: '2px' }}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-gray-300" />
              ) : (
                <Play className="w-4 h-4 text-gray-300 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              style={{ borderRadius: '2px' }}
            >
              <SkipForward className="w-4 h-4 text-gray-300" />
            </button>

            <button
              onClick={toggleMute}
              className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors ml-auto"
              style={{ borderRadius: '2px' }}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-300" />
              )}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-3">
            <VolumeX className="w-3 h-3 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-white/10 appearance-none cursor-pointer"
              style={{
                accentColor: 'rgba(180, 200, 190, 0.6)',
              }}
            />
            <Volume2 className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  )
}
