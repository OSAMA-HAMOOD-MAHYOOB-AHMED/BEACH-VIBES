// Hand-picked "natural" price-range thresholds per currency, in that
// currency's own units — not derived by converting the USD figures.
// Add a currency code here to give it market-native brackets; any
// currency not listed falls back to the USD thresholds converted at
// the live exchange rate.
const CURATED_THRESHOLDS = {
  USD: [200, 500, 1000],
  SAR: [750, 1875, 3750],
  MYR: [800, 2000, 4000],
  AED: [750, 1875, 3750],
  GBP: [150, 400, 800],
  EUR: [180, 450, 900],
}

// Returns four buckets for the given currency. `test` expects the
// product's price already converted into that currency (price * rate),
// not the raw USD value.
export function getPriceRanges(currency, rate) {
  const thresholds = CURATED_THRESHOLDS[currency] || CURATED_THRESHOLDS.USD.map((v) => v * rate)
  const [t1, t2, t3] = thresholds
  return [
    { id: 'tier1', test: (p) => p < t1, bounds: { amount: t1 } },
    { id: 'tier2', test: (p) => p >= t1 && p <= t2, bounds: { min: t1, max: t2 } },
    { id: 'tier3', test: (p) => p > t2 && p <= t3, bounds: { min: t2, max: t3 } },
    { id: 'tier4', test: (p) => p > t3, bounds: { amount: t3 } },
  ]
}
