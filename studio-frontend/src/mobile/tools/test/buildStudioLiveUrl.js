import test from "ava"
import { buildStudioLiveUrl } from "../buildStudioLiveUrl.js"

test("buildStudioLiveUrl() targets the classic quick session page", (t) => {
  t.is(buildStudioLiveUrl("org1"), "/interface/org1/quick-session")
})
