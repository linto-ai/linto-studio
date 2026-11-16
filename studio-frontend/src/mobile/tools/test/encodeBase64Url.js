import test from "ava"
import { encodeBase64Url } from "../encodeBase64Url.js"

test("encodeBase64Url() uses the URL-safe alphabet without padding", (t) => {
  t.is(encodeBase64Url(new Uint8Array([251, 255, 254])), "-__-")
  t.is(encodeBase64Url(new Uint8Array([104, 105])), "aGk")
})
