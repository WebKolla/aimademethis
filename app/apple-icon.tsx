import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
          borderRadius: '36px',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bold',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          A
        </div>
        {/* AI accent dots */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '90px',
            width: '12px',
            height: '12px',
            background: 'rgba(255,255,255,0.4)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            width: '8px',
            height: '8px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            width: '8px',
            height: '8px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
