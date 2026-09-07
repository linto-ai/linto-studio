const debug = require("debug")(
  "linto:components:WebServer:controllers:files:waveform",
)

const fs = require("fs")
const { spawn } = require("child_process")

// Stored audio is normalized to 16 kHz mono by transformAudio()
const SAMPLE_RATE = 16000
const BASE_SAMPLES_PER_PIXEL = 256
// Cap the number of RMS pairs so long recordings keep a small payload while
// staying fine-grained enough (~250ms windows on a 1h file) to show pauses
const MAX_PAIRS = 16384

// Deduplicates concurrent generations of the same waveform file
const pendingGenerations = new Map()

/*
Output mimics the BBC audiowaveform JSON shape (version 2) with one
difference: values are the RMS of each `samples_per_pixel` window (stored as
symmetric [-rms, rms, ...] pairs) instead of min/max extremes. Speech peaks
in nearly every window, so a peak envelope renders as a saturated block;
RMS keeps the dynamics and makes silences visible.
*/
function computeWaveform(audioFilePath) {
  return new Promise((resolve, reject) => {
    const streamProcess = spawn(
      "ffmpeg",
      [
        "-i",
        audioFilePath,
        "-f",
        "s16le",
        "-ac",
        "1",
        "-ar",
        `${SAMPLE_RATE}`,
        "-",
      ],
      { detached: true },
    )

    let data = []
    let sumSquares = 0
    let count = 0
    let leftover = null

    function pushWindow() {
      const rms = Math.round(Math.sqrt(sumSquares / count))
      data.push(-rms, rms)
      sumSquares = 0
      count = 0
    }

    streamProcess.stdout.on("data", (chunk) => {
      if (leftover) {
        chunk = Buffer.concat([leftover, chunk])
        leftover = null
      }
      const usable = chunk.length - (chunk.length % 2)
      for (let i = 0; i < usable; i += 2) {
        const sample = chunk.readInt16LE(i)
        sumSquares += sample * sample
        if (++count === BASE_SAMPLES_PER_PIXEL) pushWindow()
      }
      if (usable < chunk.length) leftover = chunk.subarray(usable)
    })

    streamProcess.stderr.on("data", (chunkErr) => {
      debug(`stderr - processing: ${chunkErr}`)
    })

    streamProcess.on("error", (error) => {
      reject(error)
      debug(`error: ${error.message}`)
    })

    streamProcess.on("close", (code) => {
      debug(`child process exited with code ${code}`)
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`))
        return
      }
      if (count > 0) pushWindow()

      let samplesPerPixel = BASE_SAMPLES_PER_PIXEL
      while (data.length / 2 > MAX_PAIRS) {
        const merged = []
        for (let i = 0; i + 3 < data.length; i += 4) {
          // RMS of two adjacent windows = quadratic mean of their RMS
          const rms = Math.round(
            Math.sqrt((data[i + 1] ** 2 + data[i + 3] ** 2) / 2),
          )
          merged.push(-rms, rms)
        }
        // Keep a trailing unpaired window as is
        if (data.length % 4 !== 0) {
          merged.push(data[data.length - 2], data[data.length - 1])
        }
        data = merged
        samplesPerPixel *= 2
      }

      resolve({
        version: 2,
        channels: 1,
        sample_rate: SAMPLE_RATE,
        samples_per_pixel: samplesPerPixel,
        bits: 16,
        length: data.length / 2,
        data,
      })
    })
  })
}

function waveformFilePath(audioFilePath) {
  return audioFilePath.replace(/\.[^./]+$/, "") + ".waveform.json"
}

// Returns the path of the cached waveform JSON, generating it on first call
async function getOrCreateWaveform(audioFilePath) {
  const filePath = waveformFilePath(audioFilePath)
  if (fs.existsSync(filePath)) return filePath
  if (pendingGenerations.has(filePath)) return pendingGenerations.get(filePath)

  const generation = (async () => {
    const waveform = await computeWaveform(audioFilePath)
    const tmpPath = `${filePath}.tmp`
    fs.writeFileSync(tmpPath, JSON.stringify(waveform))
    fs.renameSync(tmpPath, filePath)
    return filePath
  })().finally(() => pendingGenerations.delete(filePath))

  pendingGenerations.set(filePath, generation)
  return generation
}

module.exports = {
  computeWaveform,
  getOrCreateWaveform,
  waveformFilePath,
}
