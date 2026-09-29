import test from "ava"
import { formatFileSize } from "../formatFileSize.js"

test("bytes, kilobytes and megabytes", (t) => {
  t.is(formatFileSize(512), "512 o")
  t.is(formatFileSize(2048), "2.0 Ko")
  t.is(formatFileSize(3 * 1024 * 1024), "3.0 Mo")
})
