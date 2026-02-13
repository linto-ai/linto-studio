import { computed, inject, provide, type InjectionKey, type Ref } from 'vue'
import fr from './locales/fr'
import en from './locales/en'

export type Locale = 'fr' | 'en'
export type TranslationKey = keyof typeof fr

const locales: Record<Locale, Record<TranslationKey, string>> = { fr, en }

interface I18nContext {
  t: (key: TranslationKey) => string
  locale: Ref<Locale>
}

const i18nKey: InjectionKey<I18nContext> = Symbol('i18n')

export function provideI18n(locale: Ref<Locale>): I18nContext {
  const t = computed(() => {
    const messages = locales[locale.value] ?? locales.fr
    return (key: TranslationKey) => messages[key] ?? key
  })

  const context: I18nContext = {
    t: (key: TranslationKey) => t.value(key),
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
    t: (key: TranslationKey) => fr[key] ?? key,
    locale: fallbackLocale,
  }
}
