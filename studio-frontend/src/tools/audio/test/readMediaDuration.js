import test from "ava"
import { readMediaDuration } from "../readMediaDuration.js"

// jsdom doesn't read media: the element reports what each test decides.
function stubMedia(report) {
  const createElement = document.createElement
  const createObjectURL = URL.createObjectURL
  const revokeObjectURL = URL.revokeObjectURL
  const revoked = []
  URL.createObjectURL = () => "blob:media"
  URL.revokeObjectURL = (url) => revoked.push(url)
  document.createElement = () => ({
    set src(url) {
      report(this)
    },
  })
  return {
    revoked,
    restore() {
      document.createElement = createElement
      URL.createObjectURL = createObjectURL
      URL.revokeObjectURL = revokeObjectURL
    },
  }
}

test.serial("reads the duration and releases the file", async (t) => {
  const stub = stubMedia((media) => {
    media.duration = 12.5
    media.onloadedmetadata()
  })
  t.is(await readMediaDuration(new Blob()), 12.5)
  t.deepEqual(stub.revoked, ["blob:media"])
  stub.restore()
})

test.serial("an endless duration is unknown", async (t) => {
  const stub = stubMedia((media) => {
    media.duration = Infinity
    media.onloadedmetadata()
  })
  t.is(await readMediaDuration(new Blob()), null)
  stub.restore()
})

test.serial("an unreadable file has an unknown duration", async (t) => {
  const stub = stubMedia((media) => media.onerror())
  t.is(await readMediaDuration(new Blob()), null)
  stub.restore()
})
