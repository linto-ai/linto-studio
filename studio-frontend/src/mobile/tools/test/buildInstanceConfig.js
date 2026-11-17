import test from "ava"
import { buildInstanceConfig } from "../buildInstanceConfig.js"

test("buildInstanceConfig() points the front at the base's /api", (t) => {
  t.deepEqual(buildInstanceConfig("https://studio.linto.ai/cm-api/"), {
    VUE_APP_CONVO_API: "https://studio.linto.ai/cm-api/api",
  })
})

test("buildInstanceConfig() handles an API at the root", (t) => {
  t.deepEqual(buildInstanceConfig("http://10.0.0.2:8001"), {
    VUE_APP_CONVO_API: "http://10.0.0.2:8001/api",
  })
})
