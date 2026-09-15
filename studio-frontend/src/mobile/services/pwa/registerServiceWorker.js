import store from "@/mobile/store.js"
import i18n from "@/i18n"

const SERVICE_WORKER_URL = "/sw-mobile.js"
const SERVICE_WORKER_SCOPE = "/m/"

// Production only: the dev server has no service worker, and a stale one
// would hide hot reloads. The worker activates immediately (skipWaiting);
// assets are hashed, so the running page keeps working until it reloads.
export async function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return
  }
  try {
    const registration = await navigator.serviceWorker.register(
      SERVICE_WORKER_URL,
      { scope: SERVICE_WORKER_SCOPE },
    )
    registration.addEventListener("updatefound", () =>
      watchInstallingWorker(registration.installing),
    )
  } catch (error) {
    console.error("service worker registration failed", error)
  }
}

function watchInstallingWorker(worker) {
  if (!worker) {
    return
  }
  worker.addEventListener("statechange", () => {
    const isUpdate =
      worker.state === "installed" && navigator.serviceWorker.controller
    if (isUpdate) {
      notifyUpdateAvailable()
    }
  })
}

function notifyUpdateAvailable() {
  store.dispatch("system/addNotification", {
    message: i18n.t("mobile.update.available"),
    type: "info",
    timeout: 0,
    closable: true,
  })
}
