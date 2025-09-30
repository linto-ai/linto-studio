import studioSDK from "./index.js"
import fs from "fs"

const token = process.env.STUDIO_TOKEN
const filePath = process.env.FILE_PATH

let linto = new studioSDK({
  token,
  baseUrl: "http://127.0.0.1:8001",
  apiPath: "api",
})

const file = await fs.openAsBlob(filePath)
const handle = await linto.transcribe(file)

handle.addEventListener("update", (e) => {
  console.log("update", e.detail)
})

handle.addEventListener("done", (e) => {
  console.log("done", e.detail)
})

handle.addEventListener("error", (e) => {
  console.log("error", e.detail)
})
