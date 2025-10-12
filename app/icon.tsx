import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          borderRadius: '50%',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          <path
            d="M 32 12 L 48 48 L 42 48 L 38.5 40 L 25.5 40 L 22 48 L 16 48 L 32 12 Z M 27.5 34 L 36.5 34 L 32 22 L 27.5 34 Z"
            fill="url(#grad)"
          />

          <circle cx="32" cy="18" r="2.5" fill="#14b8a6" opacity="0.8" />
          <circle cx="46" cy="44" r="1.5" fill="#10b981" opacity="0.6" />
          <circle cx="18" cy="44" r="1.5" fill="#10b981" opacity="0.6" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
