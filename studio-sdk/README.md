# LinTO Studio SDK

LinTO Studio SDK is a toolkit to connect with LinTO Studio API.

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
import LinTO from "linto"

let linTO = new LinTO({
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

linTO = LinTO(auth_token="auth_token")

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
| authToken | yes      | string | Studio auth token   |                                |
| baseUrl   | no       | string | Studio API base url | https://studio.linto.ai/cm-api |

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

### Options

| Parameter         | required | value                           | description                                                                               | default value |
| ----------------- | -------- | ------------------------------- | ----------------------------------------------------------------------------------------- | ------------- |
| file              | yes      | File or Blob                    | Audio file to transcribe                                                                  |               |
| enableDiarization | no       | bool                            | Enable speaker diarization                                                                | True          |
| numberOfSpeaker   | no       | int                             | Number of speaker for diarization, 0 means auto                                           | 0             |
| language          | no       | 2 letters language code or "\*" | Language the audio should be transcribed. "\*" means auto-detection + multiple languages. | "\*"          |

### Callback event value

Callbacks receive a media object with 3 main properties:

- jobs
- speakers
- text

```json
{
  "jobs": {
    "transcription": {
      "state": "done"
      ...
    }
  }
  "speakers": [
    // array of speakers
    {
      "speaker_id": "60ac8c45-751e-4cf9-8617-833313dd2d12",
      "speaker_name": "speaker",
      "stime": 0,
      "etime": 16.23
    }
  ],
  "text": [
    // array of segments
    {
      "speaker_id": "60ac8c45-751e-4cf9-8617-833313dd2d12",
      "raw_segment": "bonjour je vais donner quelques chiffres hum deux cinq et je vais en donner encore d' autres huit douze un petit dernier dix mille",
      "segment": "bonjour je vais donner quelques chiffres hum 2 5 et je vais en donner encore d'autres 8 12 un petit dernier 10000",
      "words": [
        {
          "wid": "0d7ea137-ea70-467e-b3a0-8646a38a7bcb",
          "stime": 0,
          "etime": 1.41,
          "word": "bonjour",
          "confidence": 1,
          "highlights": [],
          "keywords": []
        },
        {
          "wid": "ea7f448d-a89b-4272-b8bb-f5d4d99e0504",
          "stime": 1.41,
          "etime": 1.44,
          "word": "je",
          "confidence": 1,
          "highlights": [],
          "keywords": []
        },
        ...
      ]
    }
  ]
}
```

Full object is described in the [API swagger](https://studio.linto.ai/cm-api/apidoc/#/conversations%20member/get_api_conversations__conversationId__)
