import Vue from "vue"
import { detectInstallPlatform } from "@/mobile/tools/detectInstallPlatform.js"

const DISMISS_STORAGE_KEY = "mobile.install.dismissedUntil"
const DISMISS_DAYS = 7

// Owns everything about "can this phone install the app": the captured
// beforeinstallprompt event (Android), the platform (iOS needs a guide),
// whether we already run installed, and the user's dismissal.
export const installPrompt = Vue.observable({
  platform: detectInstallPlatform(navigator.userAgent),
  standalone: isStandaloneDisplay(),
  deferredEvent: null,
  dismissedUntil: readDismissedUntil(),
})

export function listenForInstallPrompt() {
  window.addEventListener("beforeinstallprompt", keepPromptForLater)
  window.addEventListener("appinstalled", markInstalled)
}

export async function promptInstall() {
  const event = installPrompt.deferredEvent
  if (!event) {
    return "unavailable"
  }
  event.prompt()
  const choice = await event.userChoice
  installPrompt.deferredEvent = null
  return choice.outcome
}

export function dismissInstall() {
  const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000
  installPrompt.dismissedUntil = until
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(until))
  } catch (error) {
    console.error("cannot persist install dismissal", error)
  }
}

function keepPromptForLater(event) {
  event.preventDefault()
  installPrompt.deferredEvent = event
}

function markInstalled() {
  installPrompt.deferredEvent = null
  installPrompt.standalone = true
}

function isStandaloneDisplay() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true
  )
}

function readDismissedUntil() {
  try {
    return Number(localStorage.getItem(DISMISS_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}
