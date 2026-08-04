import { useState } from 'react'
import { Droplet, Flower2, Layers, Waves, ShoppingBag, Footprints } from 'lucide-react'

const PRODUCT_TONES = {
  fragrance: { from: '#f4e3c1', via: '#e0ac6f', to: '#a9713c', Icon: Droplet },
  'fragrance-gold': { from: '#f6e2ad', via: '#d6a54f', to: '#7c4f22', Icon: Droplet },
  ceramic: { from: '#ece6d8', via: '#c9beA6', to: '#8f8266', Icon: Flower2 },
  linen: { from: '#f4f0e6', via: '#ddd3ba', to: '#a99d80', Icon: Layers },
  silk: { from: '#dfe9f0', via: '#a9c1cf', to: '#5f7d8f', Icon: Waves },
  leather: { from: '#e9c9a3', via: '#c08a52', to: '#6b4322', Icon: ShoppingBag },
  footwear: { from: '#ecdec0', via: '#c99f6c', to: '#83592f', Icon: Footprints },
}

export function ProductMedia({
  tone = 'fragrance',
  image,
  alt = '',
  className = '',
  iconClassName = 'w-8 h-8',
}) {
  const t = PRODUCT_TONES[tone] || PRODUCT_TONES.fragrance
  const { Icon } = t
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(145deg, ${t.from} 0%, ${t.via} 55%, ${t.to} 100%)`,
      }}
    >
      {(!image || failed) && (
        <>
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6), transparent 45%)',
            }}
          />
          <Icon className={`${iconClassName} text-white/70 drop-shadow-sm`} strokeWidth={1.25} />
        </>
      )}
      {image && !failed && (
        <img
          src={image}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  )
}

const SCENE_TONES = {
  hero: 'linear-gradient(160deg, #cfe0e6 0%, #a9c3ce 30%, #d8cdb8 65%, #e7dcc4 100%)',
  interior: 'linear-gradient(160deg, #e9e4d8 0%, #cfd8dc 45%, #a7c0cb 100%)',
  beach: 'linear-gradient(180deg, #cfe3ec 0%, #bcd6e0 35%, #e3d4ae 65%, #d9c48f 100%)',
  coastal: 'linear-gradient(135deg, #dfe9ee 0%, #b8cdd8 50%, #93aebb 100%)',
  spotlight: 'linear-gradient(160deg, #1c2c38 0%, #2e4456 55%, #6f8698 100%)',
  invite: 'linear-gradient(160deg, #b9cdd6 0%, #cbd6c9 50%, #dfd3b0 100%)',
  dark: 'linear-gradient(160deg, #0b1c2c 0%, #16344c 100%)',
}

export function SceneMedia({ tone = 'hero', overlay = 'none', className = '', children }) {
  const bg = SCENE_TONES[tone] || SCENE_TONES.hero
  const overlays = {
    none: '',
    'dark-bottom': 'linear-gradient(to top, rgba(9,17,26,0.65), rgba(9,17,26,0) 55%)',
    'dark-full': 'rgba(9,17,26,0.38)',
    'dark-left': 'linear-gradient(to right, rgba(9,17,26,0.55), rgba(9,17,26,0) 60%)',
  }
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 75% 15%, rgba(255,255,255,0.35), transparent 40%)',
        }}
      />
      {overlay !== 'none' && (
        <div className="absolute inset-0" style={{ background: overlays[overlay] }} />
      )}
      {children}
    </div>
  )
}
