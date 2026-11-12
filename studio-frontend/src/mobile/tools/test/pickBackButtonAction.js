import test from "ava"
import {
  BACK_BUTTON_ACTION,
  pickBackButtonAction,
} from "../pickBackButtonAction.js"

test("an open sheet closes before anything else", (t) => {
  const action = pickBackButtonAction({
    hasOpenSheet: true,
    routeName: "home",
    canGoBack: true,
  })
  t.is(action, BACK_BUTTON_ACTION.CLOSE_SHEET)
})

test("home sends the app to the background even with history", (t) => {
  const action = pickBackButtonAction({
    hasOpenSheet: false,
    routeName: "home",
    canGoBack: true,
  })
  t.is(action, BACK_BUTTON_ACTION.MINIMIZE)
})

test("login sends the app to the background", (t) => {
  const action = pickBackButtonAction({
    hasOpenSheet: false,
    routeName: "login",
    canGoBack: false,
  })
  t.is(action, BACK_BUTTON_ACTION.MINIMIZE)
})

test("a sub-page goes back when there is history", (t) => {
  const action = pickBackButtonAction({
    hasOpenSheet: false,
    routeName: "media",
    canGoBack: true,
  })
  t.is(action, BACK_BUTTON_ACTION.GO_BACK)
})

test("a sub-page without history goes home", (t) => {
  const action = pickBackButtonAction({
    hasOpenSheet: false,
    routeName: "conversation",
    canGoBack: false,
  })
  t.is(action, BACK_BUTTON_ACTION.GO_HOME)
})
