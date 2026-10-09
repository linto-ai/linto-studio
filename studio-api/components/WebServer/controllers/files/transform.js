const debug = require("debug")(
  "linto:components:WebServer:controllers:files:transform",
)

const { spawn } = require("child_process")
const ARG_TRANSFORM = ["-vn", "-ar", "16000", "-ac", "1", "-b:a", "96k"]
/*
ffmpeg -i in.whatever -vn -ar 16000 -ac 1 -b:a 96k out.mp3
ffmpeg -i in.whatever -vn -c:a aac -ar 16000 -ac 1 -b:a 64k out.m4a
ffmpeg -i in.whatever -vn -c:a libfdk_aac -ar 16000 -ac 1 -b:a 64k out.m4a (best version, requires specific build for ffmpeg)
*/

// check ogg format
async function transformAudio(filePath, transformedFilePath) {
  let streamProcess = spawn(
    "ffmpeg",
    ["-y", "-i", `${filePath}`, ...ARG_TRANSFORM, transformedFilePath],
    { detached: true },
  )
  await handleStreamProcess(streamProcess)
}

async function mergeAudio(files, audioPath) {
  let fileList = []
  let filter_complex = ""
  files.map((file, index) => {
    fileList.push("-i")
    fileList.push(file)
    filter_complex += `[${index}]`
  })
  filter_complex += `amerge=inputs=${files.length}`

  let streamProcess = spawn(
    "ffmpeg",
    [
      ...fileList,
      "-filter_complex",
      filter_complex,
      ...ARG_TRANSFORM,
      audioPath,
    ],
    { detached: true },
  )
  await handleStreamProcess(streamProcess)
}

// True when ffprobe finds at least one audio stream in the file.
async function hasAudioStream(filePath) {
  const probe = spawn("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "a",
    "-show_entries",
    "stream=codec_type",
    "-of",
    "csv=p=0",
    filePath,
  ])
  try {
    const output = await handleStreamProcess(probe)
    return output.includes("audio")
  } catch (error) {
    // A missing ffprobe (spawn error) is a server fault, not an unsupported file.
    if (error.code) throw error
    return false
  }
}

async function handleStreamProcess(streamProcess) {
  let stdout = ""
  await new Promise((resolve, reject) => {
    streamProcess.stdout.on("data", (data) => {
      stdout += data
      debug(`stdout: ${data}`)
    })

    streamProcess.stderr.on("data", (data) => {
      debug(`stderr - processing: ${data}`)
    })

    streamProcess.on("error", (error) => {
      reject(error)
      debug(`error: ${error.message}`)
    })

    streamProcess.on("close", (code) => {
      debug(`child process exited with code ${code}`)
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
  return stdout
}

module.exports = {
  transformAudio,
  mergeAudio,
  hasAudioStream,
}
