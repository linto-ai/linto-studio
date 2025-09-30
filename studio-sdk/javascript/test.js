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
linto.transcribe(file)
