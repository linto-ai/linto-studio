# LinTO Studio SDK

## Install

**Python**

```sh
pip install LinTO
```

**node**

```
npm install LinTO
```

**Browser**

```
<script src="https://unpkg.com/LinTO@1.0.0/dist/LinTO.min.js"></script>
```

## QuickStart

### NodeJS

```javascript
import LinTO from "LinTO"
import fs from "fs"

let linTO = new LinTO({
  token: "M2M_token",
})

const file = await fs.openAsBlob("path/to/audio.mp3")

const handle = await linTO.transcribe(file)

handle.addEventListener("update", (e) => {
  console.log("update", e.detail)
})

handle.addEventListener("done", (e) => {
  console.log("Audio transcription", e.detail.text)
})

handle.addEventListener("error", (e) => {
  console.log("error", e.detail)
})
```

## Already implemented

### LinTO constructorm

```javascript
new LinTO({
  token = "M2M_token", // m2m token from LinTO Studio. Required.
  baseUrl = "https://studio.linto.ai", // Set the base url of LinTO Studio instance, default to "https://studio.linto.ai"
  apiPath = "cm-api", // Path for api, default to "cm-api"
  authPath = "auth", // Path for login route, default to "auth"
})
```

### Transcribe

```javascript
await linTO.transcribe(file, {
  enableDiarization = true, // boolean to enable speaker diarization
  numberOfSpeaker = "0", // Force the number of speaker for diarization process. 0 mean auto detection.
  language = "*", // Set the language code of the audio. * mean auto detection.
})
```
