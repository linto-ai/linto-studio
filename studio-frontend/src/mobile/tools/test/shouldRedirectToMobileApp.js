import test from "ava"
import { shouldRedirectToMobileApp } from "../shouldRedirectToMobileApp.js"

const phoneOnRoot = {
  enabled: true,
  isPhone: true,
  optedOut: false,
  pathname: "/",
}

test("shouldRedirectToMobileApp() redirects a phone on a classic page", (t) => {
  t.true(shouldRedirectToMobileApp(phoneOnRoot))
  t.true(
    shouldRedirectToMobileApp({
      ...phoneOnRoot,
      pathname: "/interface/explore",
    }),
  )
  t.true(shouldRedirectToMobileApp({ ...phoneOnRoot, pathname: "/login" }))
})

test("shouldRedirectToMobileApp() does nothing when the flag is off", (t) => {
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, enabled: false }))
})

test("shouldRedirectToMobileApp() keeps desktops and opted-out phones", (t) => {
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, isPhone: false }))
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, optedOut: true }))
})

test("shouldRedirectToMobileApp() never loops on the mobile app or auth callbacks", (t) => {
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, pathname: "/m/" }))
  t.false(shouldRedirectToMobileApp({ ...phoneOnRoot, pathname: "/m/record" }))
  t.false(
    shouldRedirectToMobileApp({
      ...phoneOnRoot,
      pathname: "/backoffice/users",
    }),
  )
  t.false(
    shouldRedirectToMobileApp({ ...phoneOnRoot, pathname: "/login/oidc" }),
  )
  t.false(
    shouldRedirectToMobileApp({
      ...phoneOnRoot,
      pathname: "/magiclink-auth/abc",
    }),
  )
})
