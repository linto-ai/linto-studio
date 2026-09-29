import test from "ava"
import { detectInstallPlatform } from "../detectInstallPlatform.js"

test("detectInstallPlatform() recognizes iPhone and iPad", (t) => {
  t.is(
    detectInstallPlatform(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    ),
    "ios",
  )
  t.is(
    detectInstallPlatform("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)"),
    "ios",
  )
})

test("detectInstallPlatform() recognizes Android", (t) => {
  t.is(
    detectInstallPlatform(
      "Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/120",
    ),
    "android",
  )
})

test("detectInstallPlatform() returns other for desktop or empty agents", (t) => {
  t.is(
    detectInstallPlatform("Mozilla/5.0 (X11; Linux x86_64) Firefox/120"),
    "other",
  )
  t.is(detectInstallPlatform(""), "other")
  t.is(detectInstallPlatform(undefined), "other")
})
