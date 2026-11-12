import test from "ava"
import { formatInstanceAddress } from "../formatInstanceAddress.js"

test("formatInstanceAddress() hides https:// only", (t) => {
  t.is(formatInstanceAddress("https://studio.linto.ai"), "studio.linto.ai")
  t.is(formatInstanceAddress("http://10.0.0.2:8001"), "http://10.0.0.2:8001")
})
