import test from "ava"
import { formatFileSize } from "../formatFileSize.js"

test("formatFileSize() picks the unit", (t) => {
  t.is(formatFileSize(512), "512 o")
  t.is(formatFileSize(51_200), "51 ko")
  t.is(formatFileSize(1_800_000), "1.8 Mo")
  t.is(formatFileSize(18_400_000), "18 Mo")
})
