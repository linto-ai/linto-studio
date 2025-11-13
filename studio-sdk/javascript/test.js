import LinTO from "./index.js"
import fs from "fs"

async function testListingServices() {
  const authToken = process.env.STUDIO_TOKEN
  let linTO = new LinTO({
    authToken,
    baseUrl: "http://127.0.0.1:8001",
  })
  const services = await linTO.listServices()
  console.log(services)
}

async function testTranscription() {
  const authToken = process.env.STUDIO_TOKEN
  const filePath = process.env.FILE_PATH

  let linTO = new LinTO({
    authToken,
    baseUrl: "http://127.0.0.1:8001",
  })

  const file = await fs.openAsBlob(filePath)

  const handle = await linTO.transcribe(file, { name: "test file" })

  function waitForTranscription(handle) {
    return new Promise((resolve, reject) => {
      handle.addEventListener("update", (e) => {
        console.log("update", e.detail)
      })

      handle.addEventListener("done", (e) => {
        console.log("done", e.detail.toFormat())
        console.log(e.detail.fullText)
        resolve(e.detail)
      })

      handle.addEventListener("error", (e) => {
        console.error("error", e.detail)
        reject(e.detail)
      })
    })
  }

  await waitForTranscription(handle)
}

await testListingServices()

await testTranscription()
