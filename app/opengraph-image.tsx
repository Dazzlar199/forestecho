import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'
export const dynamic = 'force-static' // Static export를 위한 설정

// Image metadata
export const alt = '숲울림 - 24시간 AI 심리상담'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #E8F5E9 0%, #4CAF50 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 로고/타이틀 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <span style={{ fontSize: '80px', marginRight: '20px' }}>🌲</span>
          <span
            style={{
              fontSize: '100px',
              fontWeight: 'bold',
              color: '#2D5016',
            }}
          >
            숲울림
          </span>
        </div>

        {/* 메인 카피 */}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          24시간 AI 심리상담
        </div>

        {/* 서브 카피 */}
        <div
          style={{
            fontSize: '36px',
            color: '#2D5016',
            textAlign: 'center',
            marginBottom: '50px',
          }}
        >
          언제 어디서나 편안하게, 전문적인 AI 심리상담
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            fontSize: '32px',
            color: 'white',
            fontWeight: '600',
            background: 'rgba(45, 80, 22, 0.8)',
            padding: '15px 40px',
            borderRadius: '30px',
          }}
        >
          forestecho.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
