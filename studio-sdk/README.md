# LinTO Studio SDK

LinTO Studio SDK is a library to interact with LinTO Studio API, it provides a simple interface to transcribe audio files.

It is available in Python and Javascript (NodeJS and web browser).

## Install

**Python**

```sh
pip install linto
```

**NodeJS or compiled front-end project**

```
npm install linto
```

**Plain JS in web browser**

```
<script src="https://unpkg.com/LinTO@1.0.0/dist/linto.min.js"></script>
```

## How to use

### NodeJS or Web browser

```javascript
import LinTO from "LinTO"

let linTO = new LinTO({
  token: "M2M_token",
})

// Choose depending on your environment

// NodeJS
import fs from "fs"
const file = await fs.openAsBlob("path/to/audio.mp3")

// Browser :
// From an <input type='file'/>
const file = document.getElementById("file").files[0]

const handle = await linTO.transcribe(file)

handle.addEventListener("update", (e) => {
  console.log("Audio transcription processing", e.detail)
})

handle.addEventListener("done", (e) => {
  console.log("Audio transcription completed", e.detail.text)
})

handle.addEventListener("error", (e) => {
  console.log("Error while processing the audio", e.detail)
})
```

**Full example**

- [NodeJS](javascript/test.js)
- [Browser](javascript/test.html)

### Python

```python
import os
from linto import LinTO

linTO = LinTO(token="M2M_token")

with open("path/to/audio.mp3", "rb") as f:
    file = f.read()

handle = await linTO.transcribe(file)

def on_update(data):
    print("Audio transcription processing", data)

def on_done(data):
    print("Audio transcription completed", data)

def on_error(data):
    print("Error while processing the audio", data)

handle.on("update", on_update)
handle.on("done", on_done)
handle.on("error", on_error)
```

See complete python script at [python/test.js](python/test.py)

## Documentation

### Initialisation

```javascript
new LinTO({
  token = "M2M_token", // m2m token from LinTO Studio. Required.
  baseUrl = "https://studio.linto.ai/cm-api", // Set the base url of LinTO Studio instance, default to "https://studio.linto.ai/cm-api"
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
