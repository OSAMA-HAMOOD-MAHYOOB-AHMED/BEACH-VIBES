import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CurrencyContext = createContext(null)

const STORAGE_KEY = 'beach-vibes-currency'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const GEO_URL = 'https://ipapi.co/json/'
const RATES_URL = 'https://open.er-api.com/v6/latest/USD'

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.currency || !parsed.rate || !parsed.fetchedAt) return null
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(currency, rate) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currency, rate, fetchedAt: Date.now() }))
  } catch {
    // Storage unavailable — display still works, just re-detects next load.
  }
}

export function CurrencyProvider({ children }) {
  const [cached] = useState(readCache)
  const [currency, setCurrency] = useState(cached?.currency || 'USD')
  const [rate, setRate] = useState(cached?.rate || 1)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    if (cached) return
    let cancelled = false

    async function detect() {
      let code = 'USD'
      let detectedRate = 1
      try {
        const geoRes = await fetch(GEO_URL)
        const geo = await geoRes.json()
        if (geo?.currency && geo.currency !== 'USD') {
          const ratesRes = await fetch(RATES_URL)
          const ratesData = await ratesRes.json()
          if (ratesData?.rates?.[geo.currency]) {
            code = geo.currency
            detectedRate = ratesData.rates[geo.currency]
          }
        }
      } catch {
        // IP geolocation or exchange-rate API unreachable — stay on USD.
      }
      if (!cancelled) {
        setCurrency(code)
        setRate(detectedRate)
        setLoading(false)
        writeCache(code, detectedRate)
      }
    }

    detect()
    return () => {
      cancelled = true
    }
  }, [cached])

  const value = useMemo(() => ({ currency, rate, loading }), [currency, rate, loading])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
