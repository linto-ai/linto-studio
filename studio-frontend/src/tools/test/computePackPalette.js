import test from "ava"
import { computePackPalette } from "../computePackPalette.js"

test("maps a color family to the accent and its wash", (t) => {
  t.deepEqual(computePackPalette("teal"), {
    "--pack-accent": "var(--material-teal-800)",
    "--pack-accent-soft": "var(--material-teal-50)",
  })
})
