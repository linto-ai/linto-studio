export const BACK_BUTTON_ACTION = {
  CLOSE_SHEET: "close-sheet",
  MINIMIZE: "minimize",
  GO_BACK: "go-back",
  GO_HOME: "go-home",
}

// Screens the Android back button leaves the app from, whatever the history
// holds: the header back link pushes routes, so the history may still hold
// pages the user already left.
const ROOT_ROUTES = ["home", "login"]

// What the Android back button does in the native app: an open sheet closes
// first, a root screen sends the app to the background, any other screen
// goes back (or home when there is nothing to go back to).
export function pickBackButtonAction({ hasOpenSheet, routeName, canGoBack }) {
  switch (true) {
    case hasOpenSheet:
      return BACK_BUTTON_ACTION.CLOSE_SHEET
    case ROOT_ROUTES.includes(routeName):
      return BACK_BUTTON_ACTION.MINIMIZE
    case canGoBack:
      return BACK_BUTTON_ACTION.GO_BACK
    default:
      return BACK_BUTTON_ACTION.GO_HOME
  }
}
