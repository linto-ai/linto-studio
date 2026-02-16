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

### Validate Token

_JavaScript only_

```javascript
const user = await linTO.validateToken()
```

Returns the current user information if the token is valid.

### Organizations

_JavaScript only_

```javascript
const organizations = await linTO.getOrganizations()
```

Returns the list of organizations the user belongs to.

### Sessions

_JavaScript only_

#### List sessions

```javascript
const sessions = await linTO.listSessions()
```

#### Get a session

```javascript
const session = await linTO.getSession(sessionId)
```

#### Create a session

```javascript
const session = await linTO.createSession({
  channels,       // Array - channel configurations
  name,           // String (optional)
  visibility,     // String (optional)
  scheduleOn,     // String (optional) - ISO date
  endOn,          // String (optional) - ISO date
  autoStart,      // Bool (optional)
  autoEnd,        // Bool (optional)
  owner,          // String (optional)
  meta,           // Object (optional)
})
```

#### Update a session

```javascript
const session = await linTO.updateSession(sessionId, { name, visibility, ... })
```

#### Stop a session

```javascript
await linTO.stopSession(sessionId, { force: false })
```

| Parameter | required | value | description                    | default value |
| --------- | -------- | ----- | ------------------------------ | ------------- |
| sessionId | yes      | String | Session ID                    |               |
| force     | no       | Bool   | Force stop the session         | false         |

#### Delete a session

```javascript
await linTO.deleteSession(sessionId, { name })
```

| Parameter | required | value  | description                           | default value |
| --------- | -------- | ------ | ------------------------------------- | ------------- |
| sessionId | yes      | String | Session ID                           |               |
| name      | no       | String | Name to save the conversation under  |               |

### Bots

_JavaScript only_

#### List bots

```javascript
const bots = await linTO.listBots()
```

#### Create a bot

```javascript
const bot = await linTO.createBot({ url, channelId, provider, enableDisplaySub })
```

| Parameter        | required | value  | description                         | default value |
| ---------------- | -------- | ------ | ----------------------------------- | ------------- |
| url              | yes      | String | Video conference URL                |               |
| channelId        | yes      | String | Channel ID to attach the bot to     |               |
| provider         | yes      | String | Video conference provider            |               |
| enableDisplaySub | no       | Bool   | Enable subtitles display in meeting | true          |

#### Get a bot

```javascript
const bot = await linTO.getBot(botId)
```

#### Delete a bot

```javascript
await linTO.deleteBot(botId)
```

### Transcriber Profiles

_JavaScript only_

```javascript
const profiles = await linTO.listTranscriberProfiles({ quickMeeting })
```

| Parameter    | required | value | description                              | default value |
| ------------ | -------- | ----- | ---------------------------------------- | ------------- |
| quickMeeting | no       | Bool  | Filter profiles for quick meeting usage  |               |

### Templates

_JavaScript only_

#### List templates

```javascript
const templates = await linTO.listTemplates()
```

#### Create a template

```javascript
const template = await linTO.createTemplate(data)
```

#### Get a template

```javascript
const template = await linTO.getTemplate(templateId)
```

#### Update a template

```javascript
const template = await linTO.updateTemplate(templateId, updates)
```

#### Delete a template

```javascript
await linTO.deleteTemplate(templateId)
```

### Quick Meetings

_JavaScript only_

#### List quick meetings

```javascript
const quickMeetings = await linTO.listQuickMeetings()
```

#### Create a quick meeting

```javascript
const quickMeeting = await linTO.createQuickMeeting(data)
```

#### Delete a quick meeting

```javascript
await linTO.deleteQuickMeeting(quickMeetingId, { trash })
```

| Parameter      | required | value  | description                        | default value |
| -------------- | -------- | ------ | ---------------------------------- | ------------- |
| quickMeetingId | yes      | String | Quick meeting ID                  |               |
| trash          | no       | Bool   | Move to trash instead of deleting |               |

### Conversations

_JavaScript only_

```javascript
const conversations = await linTO.listConversations()
```

### Public Session

_JavaScript only_

```javascript
const session = await linTO.getPublicSession(sessionId, { password })
```

| Parameter | required | value  | description                         | default value |
| --------- | -------- | ------ | ----------------------------------- | ------------- |
| sessionId | yes      | String | Session ID                         |               |
| password  | no       | String | Password for protected sessions    |               |

No authentication token is required for this method.

### Transcribe Video Conference

_JavaScript only_

Transcribe a live video conference by creating a session, attaching a bot, and returning a `MeetingHandle` to monitor the meeting lifecycle.

```javascript
const meeting = await linTO.transcribeVideoConference({
  url,
  provider,
  transcriberProfileId,
  translations,       // Array (optional)
  diarization,        // Bool (optional)
  keepAudio,          // Bool (optional)
  name,               // String (optional)
  visibility,         // String (optional)
  meta,               // Object (optional)
  enableDisplaySub,   // Bool (optional, default: true)
})

meeting.addEventListener("connected", (e) => {
  console.log("Bot connected to the meeting", e.detail)
})

meeting.addEventListener("meeting_end", (e) => {
  console.log("Meeting has ended", e.detail)
})

meeting.addEventListener("error", (e) => {
  console.log("Error", e.detail)
})

// Stop the meeting (session will not be saved)
await meeting.stop({ force: false })

// Or stop and save the transcription
await meeting.stopAndSave({ name: "My meeting" })
```

#### Options

| Parameter             | required | value  | description                                  | default value |
| --------------------- | -------- | ------ | -------------------------------------------- | ------------- |
| url                   | yes      | String | Video conference URL                         |               |
| provider              | yes      | String | Video conference provider                    |               |
| transcriberProfileId  | yes      | String | Transcriber profile ID to use                |               |
| translations          | no       | Array  | Target languages for translation             |               |
| diarization           | no       | Bool   | Enable speaker diarization                   |               |
| keepAudio             | no       | Bool   | Keep audio recording                         |               |
| name                  | no       | String | Session name                                 |               |
| visibility            | no       | String | Session visibility                           |               |
| meta                  | no       | Object | Additional metadata                          |               |
| enableDisplaySub      | no       | Bool   | Enable subtitles display in meeting          | true          |

#### MeetingHandle

The `MeetingHandle` object is returned by `transcribeVideoConference`. It extends `EventTarget` and polls the session status automatically.

**Events**

| Event        | description                                             |
| ------------ | ------------------------------------------------------- |
| connected    | Bot has connected and session is active                 |
| meeting_end  | Session has been terminated                             |
| error        | An error occurred or the session entered errored state  |

**Methods**

| Method                       | description                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| `stop({ force })`           | Stop the session without saving. `force` defaults to false. |
| `stopAndSave({ name })`     | Stop the session and save the transcription with a name.    |

**Properties**

| Property   | description              |
| ---------- | ------------------------ |
| sessionId  | The session ID           |
| channelId  | The channel ID           |
| bot        | The bot object           |
