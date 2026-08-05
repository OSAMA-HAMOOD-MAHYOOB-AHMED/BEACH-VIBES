import { useState } from 'react'
import { Waves, Sun, Umbrella, Fish, Footprints, ShoppingBag } from 'lucide-react'

const PRODUCT_TONES = {
  swimwear: { from: '#bfe3ea', via: '#6fb8c9', to: '#2e7d95', Icon: Waves },
  suncare: { from: '#ffe7b3', via: '#ffbf69', to: '#e8873f', Icon: Sun },
  beachgear: { from: '#f4ecd8', via: '#e0d2ab', to: '#c9a876', Icon: Umbrella },
  watersports: { from: '#b8d4e3', via: '#4f83a3', to: '#1f4e68', Icon: Fish },
  footwear: { from: '#ecdec0', via: '#c99f6c', to: '#83592f', Icon: Footprints },
  accessories: { from: '#f0e2c0', via: '#d4b483', to: '#a8783f', Icon: ShoppingBag },
}

export function ProductMedia({
  tone = 'swimwear',
  image,
  alt = '',
  className = '',
  iconClassName = 'w-8 h-8',
}) {
  const t = PRODUCT_TONES[tone] || PRODUCT_TONES.swimwear
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
