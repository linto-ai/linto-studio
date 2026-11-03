import test from "ava"
import { mergeNotices } from "../mergeNotices.js"

test("keeps the notices not shown yet and adds the new ones", (t) => {
  t.deepEqual(mergeNotices([{ key: "a" }], [{ key: "b" }]), [
    { key: "a" },
    { key: "b" },
  ])
})

test("a key appears once, with its latest content", (t) => {
  t.deepEqual(
    mergeNotices([{ key: "a", codes: ["fr"] }], [{ key: "a", codes: ["en"] }]),
    [{ key: "a", codes: ["en"] }],
  )
})
