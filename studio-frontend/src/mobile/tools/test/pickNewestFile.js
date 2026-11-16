import test from "ava"
import { pickNewestFile } from "../pickNewestFile.js"

test("pickNewestFile() picks the file modified last", (t) => {
  const files = [
    { uri: "file:///a.aac", mtime: 10 },
    { uri: "file:///b.aac", mtime: 30 },
    { uri: "file:///c.aac", mtime: 20 },
  ]
  t.is(pickNewestFile(files).uri, "file:///b.aac")
})

test("pickNewestFile() gives null without files", (t) => {
  t.is(pickNewestFile([]), null)
})
