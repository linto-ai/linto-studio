import test from "ava"
import { mapDiscussion } from "../mapDiscussion.js"

test("mapDiscussion() keeps the id and the title", (t) => {
  t.deepEqual(mapDiscussion({ _id: "d1", title: "Budget", extra: 1 }), {
    id: "d1",
    title: "Budget",
  })
})
