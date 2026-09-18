import test from "ava"
import { canOfferInstall } from "../canOfferInstall.js"

const NOW = 1_000_000
const android = {
  standalone: false,
  dismissedUntil: 0,
  hasPromptEvent: true,
  platform: "android",
}

test("canOfferInstall() offers the native prompt when Android captured it", (t) => {
  t.true(canOfferInstall(android, NOW))
  t.false(canOfferInstall({ ...android, hasPromptEvent: false }, NOW))
})

test("canOfferInstall() offers the guide on iOS without any event", (t) => {
  t.true(
    canOfferInstall(
      { ...android, hasPromptEvent: false, platform: "ios" },
      NOW,
    ),
  )
})

test("canOfferInstall() stays quiet when installed or dismissed", (t) => {
  t.false(canOfferInstall({ ...android, standalone: true }, NOW))
  t.false(canOfferInstall({ ...android, dismissedUntil: NOW + 1 }, NOW))
  t.true(canOfferInstall({ ...android, dismissedUntil: NOW - 1 }, NOW))
})
