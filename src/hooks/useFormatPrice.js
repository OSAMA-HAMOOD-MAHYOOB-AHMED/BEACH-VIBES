import { useCurrency } from '../context/CurrencyContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice as formatPriceBase } from '../utils/format'

export function useFormatPrice() {
  const { currency, rate } = useCurrency()
  const { language } = useLanguage()
  const locale = language === 'ar' ? 'ar' : 'en-US'

  return (value) => formatPriceBase(value, { currency, rate, locale })
}
