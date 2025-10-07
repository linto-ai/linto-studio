# LinTO Studio SDK

LinTO Studio SDK is a wrapper around LinTO Studio API. You can generate an auth token from [LinTO Studio](https://studio.linto.ai) in the organization settings.

It is available in Python and Javascript (NodeJS and web browser).

## Install

**Python**

```sh
pip install linto
```

**NodeJS or compiled front-end project**

```
npm install @linto-ai/linto
```

**Plain JS in web browser**

```html
<script type="module" src="https://unpkg.com/@linto-ai/linto/index.js"></script>
```

## How to use

### NodeJS or Web browser

```javascript
// NodeJS
import LinTO from "@linto-ai/linto"
let linTO = new LinTO({
  authToken: "authToken",
})

// Browser
let linTO = new window.LinTO({
  authToken: "authToken",
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
  console.log("Audio transcription completed")
  console.log("Full text", e.detail.fullText)
  console.log("Formated output", e.detail.toFormat())
  console.log("Turns list", e.detail.turns)
  console.log("Api response", e.detail.response)
})

handle.addEventListener("error", () => {
  console.log("Error while processing the audio")
})
```

**Full example**

- [NodeJS](javascript/test.js)
- [Browser](javascript/test.html)

### Python

```python
import os
from linto import LinTO

linTO = LinTO(auth_token="auth_token")

with open("path/to/audio.mp3", "rb") as f:
    file = f.read()

handle = await linTO.transcribe(file)

def on_update(data):
    print("Audio transcription processing", data)

def on_done(data):
    print("Audio transcription completed")
    print("Full text", data.full_text)
    print("Formated output", data.to_format())
    print("Turns list", data.turns)
    print("Api response", data.response)

def on_error(data):
    print("Error while processing the audio")

handle.on("update", on_update)
handle.on("done", on_done)
handle.on("error", on_error)
```

See complete python script at [python/test.js](python/test.py)

## Documentation

_Options in camelCase are the same in pascal_case for Python_

### Initialisation

```javascript
// Javascript
linTO = new LinTO({authToken = "auth_token", ...options})
```

```python
# Python
linTO = LinTO(auth_token="auth_token", **options)
```

#### Options

| Parameter | required | value  | description         | default value                  |
| --------- | -------- | ------ | ------------------- | ------------------------------ |
| authToken | yes      | String | Studio auth token   |                                |
| baseUrl   | no       | String | Studio API base url | https://studio.linto.ai/cm-api |

### Transcribe

```javascript
// Javascript
const handle = await linTO.transcribe(file, { ...options })

handle.addEventListener("update", callback)
handle.addEventListener("done", callback)
handle.addEventListener("error", callback)
```

```python
# Python
await linTO.transcribe(file, **options)

handle.on("update", callback)
handle.on("done", callback)
handle.on("error", callback)
```

#### Options

| Parameter         | required | value                           | description                                                                              | default value           |
| ----------------- | -------- | ------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| file              | yes      | File or Blob                    | Audio file to transcribe                                                                 |                         |
| enableDiarization | no       | Bool                            | Enable speaker diarization                                                               | True                    |
| numberOfSpeaker   | no       | Int                             | Number of speaker for diarization, 0 means auto                                          | 0                       |
| language          | no       | 2 letters language code or "\*" | Language the audio should be transcribed. "\*" means auto-detection + multiple languages | "\*"                    |
| enablePunctuation | no       | Bool                            | Enable automatic punctuation recognition                                                 | True                    |
| name              | no       | String                          | Name of the media in LinTO Studio                                                        | "imported file ${date}" |

#### toFormat options

| Parameter      | required | value  | description                                                                                             | default value                                  |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| sep            | no       | String | Separator between metadatas                                                                             | " - "                                          |
| metaTextSep    | no       | String | Separator between metadata and text                                                                     | " : "                                          |
| eol            | no       | String | End of line character ("CRLF" or "LF" or None). If neither "CRLF" or "LF", no carriage return is added. | "CRLF"                                         |
| ensureFinalEOL | no       | Bool   | Whether to ensure final end of line                                                                     | false                                          |
| include        | no       | Object | Which metadata to include (speaker, lang, timestamp)                                                    | { speaker: true, lang: true, timestamp: true } |
| order          | no       | Array  | Order of metadata in output                                                                             | ["speaker", "lang", "timestamp"]               |

## Coming soon 🏗️

### Transcribe video conference

```javascript
const meeting = await linTO.transcribeVideoConference({ type, url, ...options })
meeting.addEventListener("connected", callback)
meeting.addEventListener("meeting_start", callback)
meeting.addEventListener("people_join", callback)
meeting.addEventListener("meeting_end", callback)
meeting.addEventListener("transcription", callback)

handle = await meeting.offlineTranscription({ ...options })
handle.addEventListener("update", callback)
handle.addEventListener("done", callback)
handle.addEventListener("error", callback)
```

### Live transcription

```javascript
const live = await linTO.transcribeLive({ ...option })
live.connectAudio(source)
live.startTranscription()
live.stopTranscription()
live.addEventListener("transcription", callback)
```
