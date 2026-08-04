import { Star } from 'lucide-react'

export default function StarRating({ rating = 5, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating)
        return (
          <Star
            key={i}
            width={size}
            height={size}
            className={filled ? 'text-navy-800 fill-navy-800' : 'text-navy-200 fill-navy-200'}
          />
        )
      })}
    </div>
  )
}
