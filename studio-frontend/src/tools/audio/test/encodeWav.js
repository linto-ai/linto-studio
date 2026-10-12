import test from "ava"
import { encodeWav } from "../encodeWav.js"

async function readView(blob) {
  return new DataView(await blob.arrayBuffer())
}

function readAscii(view, offset, length) {
  let text = ""
  for (let i = 0; i < length; i++) {
    text += String.fromCharCode(view.getUint8(offset + i))
  }
  return text
}

test("writes a mono 16-bit PCM header at the given sample rate", async (t) => {
  const blob = encodeWav([new Float32Array([0, 0.5])], 48000)
  const view = await readView(blob)

  t.is(blob.type, "audio/wav")
  t.is(readAscii(view, 0, 4), "RIFF")
  t.is(readAscii(view, 8, 4), "WAVE")
  t.is(view.getUint16(20, true), 1)
  t.is(view.getUint16(22, true), 1)
  t.is(view.getUint32(24, true), 48000)
  t.is(view.getUint32(28, true), 96000)
  t.is(view.getUint16(34, true), 16)
  t.is(view.getUint32(40, true), 4)
  t.is(view.byteLength, 48)
})

test("concatenates frames and clamps samples to 16-bit range", async (t) => {
  const blob = encodeWav(
    [new Float32Array([0, 1]), new Float32Array([-1, 2, -3])],
    16000,
  )
  const view = await readView(blob)

  t.is(view.getUint32(40, true), 10)
  t.is(view.getInt16(44, true), 0)
  t.is(view.getInt16(46, true), 32767)
  t.is(view.getInt16(48, true), -32768)
  t.is(view.getInt16(50, true), 32767)
  t.is(view.getInt16(52, true), -32768)
})

test("an empty recording gives a header-only file", async (t) => {
  const blob = encodeWav([], 44100)
  const view = await readView(blob)
  t.is(view.byteLength, 44)
  t.is(view.getUint32(40, true), 0)
})
