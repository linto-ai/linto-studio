import test from "ava"
import { buildApiUnreachableRoute } from "../buildApiUnreachableRoute.js"

test("buildApiUnreachableRoute() keeps the page asked for", (t) => {
  t.deepEqual(buildApiUnreachableRoute({ fullPath: "/record?x=1" }), {
    name: "api-unreachable",
    query: { page: "/record?x=1" },
  })
})
