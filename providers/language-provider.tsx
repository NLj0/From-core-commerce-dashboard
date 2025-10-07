"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import Cookies from "js-cookie"

type Locale = "en" | "ar"

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en")
  const [messages, setMessages] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  // تحميل الترجمات عند تغيير اللغة
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await import(`@/messages/${locale}.json`)
        setMessages(msgs.default)
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error)
      }
    }
    loadMessages()
  }, [locale])

  // تحديث اللغة وحفظها
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    Cookies.set("NEXT_LOCALE", newLocale, { expires: 365 })
    
    // تحديث HTML attributes
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLocale
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
      
      // تطبيق الخط العربي
      if (newLocale === "ar") {
        document.body.style.fontFamily = "var(--font-cairo), system-ui, sans-serif"
      } else {
        document.body.style.fontFamily = "var(--font-geist-sans), system-ui, sans-serif"
      }
    }
  }

  // قراءة اللغة المحفوظة أو الكشف التلقائي عند التحميل الأول
  useEffect(() => {
    const savedLocale = Cookies.get("NEXT_LOCALE") as Locale
    
    if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
      setLocaleState(savedLocale)
      if (typeof document !== "undefined") {
        document.documentElement.lang = savedLocale
        document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr"
        
        // تطبيق الخط
        if (savedLocale === "ar") {
          document.body.style.fontFamily = "var(--font-cairo), system-ui, sans-serif"
        } else {
          document.body.style.fontFamily = "var(--font-geist-sans), system-ui, sans-serif"
        }
      }
    } else {
      // الكشف التلقائي من المتصفح
      if (typeof navigator !== "undefined") {
        const browserLang = navigator.language.split("-")[0]
        if (browserLang === "ar") {
          setLocale("ar")
        }
      }
    }
    
    setIsLoading(false)
  }, [])

  // دالة الترجمة مع دعم Nested keys
  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = messages

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]
      } else {
        return key // إرجاع المفتاح نفسه إذا لم يتم العثور على الترجمة
      }
    }

    return typeof value === "string" ? value : key
  }

  const dir = locale === "ar" ? "rtl" : "ltr"

  // عرض loading بسيط أثناء التحميل الأولي
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
