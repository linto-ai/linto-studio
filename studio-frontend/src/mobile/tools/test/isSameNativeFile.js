import test from "ava"
import { isSameNativeFile } from "../isSameNativeFile.ts"

const file = { directory: "DATA", path: "recordings/a.aac" }

test("isSameNativeFile() matches the same directory and path", (t) => {
  t.true(
    isSameNativeFile(file, { directory: "DATA", path: "recordings/a.aac" }),
  )
})

test("isSameNativeFile() tells apart the same path in another directory", (t) => {
  t.false(
    isSameNativeFile(file, { directory: "CACHE", path: "recordings/a.aac" }),
  )
})

test("isSameNativeFile() tells apart another path", (t) => {
  t.false(
    isSameNativeFile(file, { directory: "DATA", path: "recordings/b.aac" }),
  )
})

test("isSameNativeFile() is false without a file", (t) => {
  t.false(isSameNativeFile(file, null))
  t.false(isSameNativeFile(null, null))
})
