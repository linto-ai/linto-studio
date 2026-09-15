import Vue from "vue"
import { detectInstallPlatform } from "@/mobile/tools/detectInstallPlatform.js"

const DISMISS_STORAGE_KEY = "mobile.install.dismissedUntil"
const DISMISS_DAYS = 7

const standaloneQuery = window.matchMedia("(display-mode: standalone)")

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
  window.addEventListener("appinstalled", forgetPromptEvent)
  standaloneQuery.addEventListener("change", updateStandalone)
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

// "appinstalled" only says Chrome accepted the install: this tab still runs
// in the browser and the install may fail afterwards, so the account row keeps
// offering it (the Android guide then explains the menu path). Only a real
// standalone display hides the offer.
function forgetPromptEvent() {
  installPrompt.deferredEvent = null
}

function updateStandalone() {
  installPrompt.standalone = isStandaloneDisplay()
}

function isStandaloneDisplay() {
  return standaloneQuery.matches || navigator.standalone === true
}

function readDismissedUntil() {
  try {
    return Number(localStorage.getItem(DISMISS_STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}
