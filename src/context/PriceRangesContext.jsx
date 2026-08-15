import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { DEFAULT_THRESHOLDS } from '../data/priceRanges'

const PriceRangesContext = createContext(null)

function mapRows(rows) {
  const map = {}
  for (const row of rows) {
    map[row.currency] = [Number(row.tier1), Number(row.tier2), Number(row.tier3)]
  }
  return map
}

export function PriceRangesProvider({ children }) {
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS)

  useEffect(() => {
    let cancelled = false
    api
      .get('/api/price-ranges')
      .then((data) => {
        if (cancelled) return
        if (data.priceRanges && data.priceRanges.length > 0) {
          setThresholds(mapRows(data.priceRanges))
        }
      })
      .catch(() => {
        // Backend unreachable — keep the static defaults.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <PriceRangesContext.Provider value={thresholds}>{children}</PriceRangesContext.Provider>
}

export function usePriceRangeThresholds() {
  const ctx = useContext(PriceRangesContext)
  if (!ctx) throw new Error('usePriceRangeThresholds must be used within PriceRangesProvider')
  return ctx
}
