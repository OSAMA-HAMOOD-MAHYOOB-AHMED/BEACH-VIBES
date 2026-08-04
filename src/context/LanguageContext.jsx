import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'beach-vibes-lang'
const RTL_LANGUAGES = new Set(['ar'])

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'ar' || stored === 'en' ? stored : 'en'
}

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

function interpolate(template, vars) {
  if (typeof template !== 'string' || !vars) return template
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => (vars[key] != null ? vars[key] : match))
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)
  const dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const t = useCallback(
    (path, vars) => {
      const value = resolvePath(translations[language], path) ?? resolvePath(translations.en, path)
      if (value == null) return path
      return typeof value === 'string' ? interpolate(value, vars) : value
    },
    [language],
  )

  const value = useMemo(() => ({ language, setLanguage, dir, t }), [language, setLanguage, dir, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
