import Vue from "vue"
import VueI18n from "vue-i18n"
Vue.use(VueI18n)
import enUS from "./locales/en-US.json"
import frFR from "./locales/fr-FR.json"

const locales = ["fr-FR", "en-US"]

function loadLocaleMessages() {
  const messages = {}
  messages["en-US"] = enUS
  messages["fr-FR"] = frFR
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

export default new VueI18n({
  locale: getUserLocal(),
  fallbackLocale: "en-US",
  messages: loadLocaleMessages(),
  interpolation: {
    escapeValue: false,
  },
})
