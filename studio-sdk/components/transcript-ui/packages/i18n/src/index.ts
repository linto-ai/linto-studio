import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'
import fr from './locales/fr'
import en from './locales/en'

export type Locale = 'fr' | 'en'
export type TranslationKey = keyof typeof fr

const locales: Record<Locale, Record<TranslationKey, string>> = { fr, en }

interface I18nContext {
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
  locale: Ref<Locale>
}

const i18nKey: InjectionKey<I18nContext> = Symbol('i18n')

function format(template: string, params?: Record<string, string | number>): string {
  let str = template
  if (params && Object.prototype.hasOwnProperty.call(params, 'count')) {
    const count = Number(params.count)
    const parts = str.split('|').map((s) => s.trim())
    if (parts.length >= 2) {
      str = count === 1 ? parts[0]! : parts[1]!
    }
  }
  if (params) {
    str = str.replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(params, key)
        ? String(params[key])
        : `{${key}}`,
    )
  }
  return str
}

export function provideI18n(locale: Ref<Locale>): I18nContext {
  const t = computed(() => {
    const messages = locales[locale.value] ?? locales.fr
    return (key: TranslationKey, params?: Record<string, string | number>) =>
      format(messages[key] ?? key, params)
  })

  const context: I18nContext = {
    t: (key, params) => t.value(key, params),
    locale,
  }

  provide(i18nKey, context)
  return context
}

export function useI18n(): I18nContext {
  const context = inject(i18nKey)
  if (context) return context

  const fallbackLocale = computed(() => 'fr' as Locale)
  return {
    t: (key, params) => format(fr[key] ?? key, params),
    locale: fallbackLocale,
  }
}
