import studioSDK from "./index.js"
import fs from "fs"

const token = process.env.STUDIO_TOKEN
let linto = new studioSDK({
  token,
  baseUrl: "http://127.0.0.1:8001",
  apiPath: "api",
})

const file = fs.openAsBlob("/home/tom/Musique/audio/baudelaire 2.wav")
linto.transcribe(file)
