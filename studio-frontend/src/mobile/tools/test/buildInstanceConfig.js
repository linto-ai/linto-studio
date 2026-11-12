import test from "ava"
import { buildInstanceConfig } from "../buildInstanceConfig.js"

test("buildInstanceConfig() splits the websocket origin and path", (t) => {
  t.deepEqual(buildInstanceConfig("https://studio.linto.ai/cm-api"), {
    VUE_APP_CONVO_API: "https://studio.linto.ai/cm-api/api",
    VUE_APP_CONVO_AUTH: "https://studio.linto.ai/cm-api/auth",
    VUE_APP_PUBLIC_MEDIA: "https://studio.linto.ai/cm-api/media",
    VUE_APP_SESSION_WS: "https://studio.linto.ai",
    VUE_APP_SESSION_WS_PATH: "/cm-api/socket.io",
  })
})

test("buildInstanceConfig() handles an API at the root", (t) => {
  const config = buildInstanceConfig("http://10.0.0.2:8001")
  t.is(config.VUE_APP_CONVO_API, "http://10.0.0.2:8001/api")
  t.is(config.VUE_APP_SESSION_WS, "http://10.0.0.2:8001")
  t.is(config.VUE_APP_SESSION_WS_PATH, "/socket.io")
})
