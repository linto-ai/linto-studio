import { createI18n } from "vue-i18n"
import enUS from "./locales/en-US.json"
import frFR from "./locales/fr-FR.json"

import getCurrentTheme from "./tools/getCurrentTheme.js"

const locales = getCurrentTheme()?.["locales"] || ["en-US"]

function loadLocaleMessages() {
  const messagesFromTheme = getCurrentTheme()?.["localesStrings"] || {}

  const messages = {}
  messages["en-US"] = enUS
  messages["fr-FR"] = frFR

  // Merge messages from theme with default messages
  for (const locale of locales) {
    let currentMessages = {}

    if (!messagesFromTheme[locale]) {
      currentMessages = messages?.[locale] || {}
    } else if (!messages[locale]) {
      currentMessages = messagesFromTheme[locale]
    } else {
      currentMessages = { ...messages[locale], ...messagesFromTheme[locale] }
    }

    messages[locale] = currentMessages
  }
  return messages
}

function getUserLocal() {
  const userLanguage = window.navigator.language
  const persistantLanguage = localStorage.getItem("lang")

  return (
    persistantLanguage ||
    locales.find((l) => l.indexOf(userLanguage) > -1) ||
    "en-US"
  )
}

export default createI18n({
  legacy: false, // Use Composition API mode
  locale: getUserLocal(),
  fallbackLocale: "en-US",
  messages: loadLocaleMessages(),
  globalInjection: true, // Allow $t in templates
})
