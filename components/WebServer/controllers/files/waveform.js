const debug = require('debug')('linto:components:WebServer:controller:file:waveform')

const { spawn } = require("child_process")
/*
audiowaveform -i file.mp3 -o ./storages/audiowaveform/file.json
*/

// check ogg format
async function generateAudioWaveform(inputFile, outputFile) {
  let streamProcess = spawn("audiowaveform", ['-i', `${inputFile}`,'-o', `./${process.env.VOLUME_FOLDER}/audiowaveform/${outputFile}`], { detached: true })
  await handleStreamProcess(streamProcess)
}

async function handleStreamProcess(streamProcess) {
  await new Promise((resolve, reject) => {
    streamProcess.stdout.on("data", data => {
      debug(`stdout: ${data}`)
    })

    streamProcess.stderr.on("data", data => {
      debug(`stderr - processing: ${data}`)
    })

    streamProcess.on("error", error => {
      reject(error)
      debug(`error: ${error.message}`)
    })

    streamProcess.on("close", code => {
      debug(`child process exited with code ${code}`)
      resolve()
    })
  })
}

module.exports = { generateAudioWaveform }