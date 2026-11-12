import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import {
  BACK_BUTTON_ACTION,
  pickBackButtonAction,
} from "@/mobile/tools/pickBackButtonAction.js"

// Native app only: without a listener, Android sends the app to the
// background from every screen. Registering one hands the button over to us
// entirely. The plugin is imported lazily so the web build never ships it.
export async function listenForBackButton(router) {
  if (!IS_NATIVE_APP) {
    return
  }
  try {
    const { App } = await import("@capacitor/app")
    App.addListener("backButton", ({ canGoBack }) =>
      onBackButton(App, router, canGoBack),
    )
  } catch (error) {
    console.error("back button listener registration failed", error)
  }
}

function onBackButton(App, router, canGoBack) {
  // Every sheet is a BottomSheet, a native <dialog>: closing it fires its
  // "close" event, which updates the sheet's v-model.
  const openSheet = document.querySelector("dialog[open]")
  const action = pickBackButtonAction({
    hasOpenSheet: Boolean(openSheet),
    routeName: router.currentRoute.name,
    canGoBack,
  })
  switch (action) {
    case BACK_BUTTON_ACTION.CLOSE_SHEET:
      openSheet.close()
      break
    case BACK_BUTTON_ACTION.MINIMIZE:
      App.minimizeApp()
      break
    case BACK_BUTTON_ACTION.GO_BACK:
      router.back()
      break
    default:
      router.replace({ name: "home" }).catch(() => {})
  }
}
