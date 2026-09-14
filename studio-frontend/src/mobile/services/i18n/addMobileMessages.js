import frFR from "@/mobile/locales/fr-FR.json"
import enUS from "@/mobile/locales/en-US.json"

const MOBILE_MESSAGES = { "fr-FR": frFR, "en-US": enUS }

// The mobile strings live under src/mobile/locales and are merged into the
// shared i18n instance at startup, so the classic bundle never carries them.
export function addMobileMessages(i18n) {
  Object.entries(MOBILE_MESSAGES).forEach(([locale, messages]) => {
    i18n.mergeLocaleMessage(locale, { mobile: messages })
  })
}
