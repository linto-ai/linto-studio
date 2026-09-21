import test from "ava"
import { shouldRedirectToMobileApp } from "../shouldRedirectToMobileApp.js"

const phoneOnRoot = {
  enabled: true,
  isPhone: true,
  optedOut: false,
  pathname: "/",
}

test("shouldRedirectToMobileApp() redirects a phone on the root", (t) => {
  t.true(shouldRedirectToMobileApp(phoneOnRoot))
})

test("shouldRedirectToMobileApp() does nothing when the flag is off", (t) => {
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, enabled: false }))
})

test("shouldRedirectToMobileApp() keeps desktops and opted-out phones", (t) => {
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, isPhone: false }))
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, optedOut: true }))
})

test("shouldRedirectToMobileApp() leaves every URL other than the root", (t) => {
  const paths = [
    "/m/",
    "/m/record",
    "/login",
    "/login/oidc",
    "/create-account",
    "/reset-password",
    "/magiclink-auth/abc",
    "/backoffice/users",
    "/interface/explore",
    "/interface/org1/sessions/session1",
    "/interface/org1/conversations/conv1/transcription",
    "/interface/org1/conversations/create",
    "/interface/org1/quick-session",
  ]
  for (const pathname of paths) {
    t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, pathname }), pathname)
  }
})
