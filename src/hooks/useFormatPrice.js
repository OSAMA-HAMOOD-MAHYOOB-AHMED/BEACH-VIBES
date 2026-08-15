import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice as formatPriceBase } from '../utils/format'

export function useFormatPrice() {
  const { currency, rate } = useCurrency()
  const { language } = useLanguage()
  const locale = language === 'ar' ? 'ar' : 'en-US'

  return (value) => formatPriceBase(value, { currency, rate, locale })
}

// For values already expressed in the detected local currency (e.g. a
// curated price-range threshold), as opposed to useFormatPrice's USD input.
export function useFormatLocalAmount() {
  const { currency } = useCurrency()
  const { language } = useLanguage()
  const locale = language === 'ar' ? 'ar' : 'en-US'

  return (value) => formatPriceBase(value, { currency, rate: 1, locale })
}
