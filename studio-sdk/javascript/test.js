import LinTO from "./index.js"
import fs from "fs"

const token = process.env.STUDIO_TOKEN
const filePath = process.env.FILE_PATH

let linTO = new LinTO({
  token,
  baseUrl: "http://127.0.0.1:8001",
})

const file = await fs.openAsBlob(filePath)

const handle = await linTO.transcribe(file)

function waitForTranscription(handle) {
  return new Promise((resolve, reject) => {
    handle.addEventListener("update", (e) => {
      console.log("update", e.detail)
    })

    handle.addEventListener("done", (e) => {
      console.log("done", e.detail)
      resolve(e.detail)
    })

    handle.addEventListener("error", (e) => {
      console.error("error", e.detail)
      reject(e.detail)
    })
  })
}

await waitForTranscription(handle)
