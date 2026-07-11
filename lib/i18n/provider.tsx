"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { I18nEngine, type Locale } from './engine'
import { zhCN } from './locales/zh-CN-app'
import { enApp } from './locales/en-app'

interface I18nContextValue {
  locale: Locale
  t: (key: string, params?: Record<string, string>) => string
  setLocale: (locale: Locale) => Promise<void>
  locales: Locale[]
}

const I18nContext = createContext<I18nContextValue | null>(null)

let engineInstance: I18nEngine | null = null

function getEngine(): I18nEngine {
  if (!engineInstance) {
    engineInstance = new I18nEngine({
      locale: 'zh-CN',
      fallbackLocale: 'en',
      cache: { enabled: true, maxSize: 2000, ttl: 10 * 60 * 1000 },
    })
    engineInstance.registerTranslation('zh-CN', zhCN)
    engineInstance.registerTranslation('en', enApp)
  }
  return engineInstance
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const engine = getEngine()
  const [locale, setLocaleState] = useState<Locale>(engine.getLocale())

  useEffect(() => {
    const unsub = engine.subscribe((newLocale) => {
      setLocaleState(newLocale)
    })
    return unsub
  }, [engine])

  const setLocale = useCallback(async (newLocale: Locale) => {
    await engine.setLocale(newLocale)
    document.documentElement.lang = newLocale
  }, [engine])

  const t = useCallback((key: string, params?: Record<string, string>) => {
    return engine.t(key, params)
  }, [engine])

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, locales: ['zh-CN', 'en'] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return ctx
}

export function useT() {
  return useI18n().t
}
