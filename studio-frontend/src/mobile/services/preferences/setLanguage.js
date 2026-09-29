import i18n from "@/i18n"

// Same storage key as the classic language switcher, so both apps agree.
export function setLanguage(locale) {
  i18n.locale = locale
  try {
    localStorage.setItem("lang", locale)
  } catch (error) {
    console.error("cannot persist language preference", error)
  }
}
