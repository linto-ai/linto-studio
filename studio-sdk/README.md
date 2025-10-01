# LinTO Studio SDK

LinTO Studio SDK is a library to interact with the LinTO studio API, it provides a simple interface to transcribe audio files and get the transcription result.

## Install

**Python**

```sh
pip install linto
```

**Node.js and compiled front-end project**

```
npm install linto
```

**Plain js in browser**

```
<script src="https://unpkg.com/LinTO@1.0.0/dist/linto.min.js"></script>
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

See complete nodejs test script at [javascript/test.js](javascript/test.js)

### Browser

Same as nodeJs version except the `fs` use.

Per exemple, get file from an `<input type='file'/>`

```javascript
const file = document.getElementById("file").files[0]
```

See example at [javascript/test.html](javascript/test.html)

### Python

```python
from linto import LinTO
import os

linTO = LinTO(token="M2M_token")

with open("path/to/audio.mp3", "rb") as f:
    file = f.read()

handle = await linTO.transcribe(file)

def on_update(data):
    print("update", data)

def on_done(data):
    print("done", data)

def on_error(data):
    print("error", data)

handle.on("update", on_update)
handle.on("done", on_done)
handle.on("error", on_error)
```

See complete python test script at [python/test.js](python/test.py)

## Already implemented

### LinTO constructor

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
