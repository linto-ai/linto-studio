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

## Quick start

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

See complete python script at [python/test.py](python/test.py)

## API reference

_Method names and options in `camelCase` are the same in `snake_case` for Python (e.g. `enableDiarization` → `enable_diarization`, `setConversationOwner` → `set_conversation_owner`)._

### Initialisation

```javascript
// Javascript
const linTO = new LinTO({ authToken: "auth_token", ...options })
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

---

### Transcription

#### transcribe

Upload a media file and start a transcription job. Returns a polling handle that emits `update`, `done`, and `error` events.

```javascript
// Javascript
const handle = await linTO.transcribe(file, { ...options })

handle.addEventListener("update", callback)
handle.addEventListener("done", callback)
handle.addEventListener("error", callback)
```

```python
# Python
handle = await linTO.transcribe(file, **options)

handle.on("update", callback)
handle.on("done", callback)
handle.on("error", callback)
```

| Parameter         | required | value                           | description                                                                              | default value           |
| ----------------- | -------- | ------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| file              | yes      | File or Blob                    | Audio file to transcribe                                                                 |                         |
| enableDiarization | no       | Bool                            | Enable speaker diarization                                                               | True                    |
| numberOfSpeaker   | no       | Int                             | Number of speakers for diarization, 0 means auto                                         | 0                       |
| language          | no       | 2 letters language code or "\*" | Language the audio should be transcribed. "\*" means auto-detection + multiple languages | "\*"                    |
| enablePunctuation | no       | Bool                            | Enable automatic punctuation recognition                                                 | True                    |
| name              | no       | String                          | Name of the media in LinTO Studio                                                        | "imported file ${date}" |
| membersRight      | no       | Int                             | Default permission bitmask for organization members on the resulting conversation (1 = read) | None                |

#### listServices

List ASR (speech-to-text) services available to the current account. Each service exposes a `service_name` field that can be referenced elsewhere.

```javascript
// Javascript
const services = await linTO.listServices()
```

```python
# Python
services = await linTO.list_services()
```

---

### LLM summaries

#### listLlmServices

List LLM services available for summarization.

```javascript
// Javascript
const services = await linTO.listLlmServices()
```

```python
# Python
services = await linTO.list_llm_services()
```

#### summarize

Trigger an LLM summary and return a polling handle. Events are the same shape as `transcribe`: `update`, `done` (with `{ content, jobId }`), `error`.

```javascript
// Javascript
const handle = await linTO.summarize(conversationId, serviceRoute, { ...options })

handle.addEventListener("done", (e) => console.log(e.detail.content))
```

```python
# Python
handle = await linTO.summarize(conversation_id, service_route, **options)

handle.on("done", lambda e: print(e["content"]))
```

| Parameter      | required | value  | description                                            | default value |
| -------------- | -------- | ------ | ------------------------------------------------------ | ------------- |
| conversationId | yes      | String | Target conversation id                                 |               |
| serviceRoute   | yes      | String | LLM service route (see `listLlmServices`)              |               |
| flavor         | no       | String | Optional flavor / preset name                          | None          |

---

### Export & download

#### downloadConversation

Download the raw transcription (no LLM step). Binary formats (`docx`, `odt`, `verbatim`) return a Blob (browser) or ArrayBuffer (Node); other formats return JSON.

```javascript
// Javascript
const blob = await linTO.downloadConversation(conversationId, { format: "docx" })
```

```python
# Python
content = await linTO.download_conversation(conversation_id, format="docx")
```

| Parameter      | required | value  | description                       | default value |
| -------------- | -------- | ------ | --------------------------------- | ------------- |
| conversationId | yes      | String | Target conversation id            |               |
| format         | no       | String | `"docx"`, `"odt"`, `"json"`, ...  | "docx"        |

#### getExportList

List existing export jobs attached to a conversation.

```javascript
// Javascript
const jobs = await linTO.getExportList(conversationId)
```

```python
# Python
jobs = await linTO.get_export_list(conversation_id)
```

#### getExportContent

Fetch the content of a finished export job.

```javascript
// Javascript
const content = await linTO.getExportContent(conversationId, jobId)
```

```python
# Python
content = await linTO.get_export_content(conversation_id, job_id)
```

#### getPublicationTemplates

List publication templates available on the organization.

```javascript
// Javascript
const templates = await linTO.getPublicationTemplates()
```

```python
# Python
templates = await linTO.get_publication_templates()
```

#### getTemplatePlaceholders

Get placeholders defined on a publication template.

```javascript
// Javascript
const placeholders = await linTO.getTemplatePlaceholders(templateId)
```

```python
# Python
placeholders = await linTO.get_template_placeholders(template_id)
```

#### exportWithTemplate

Render a publication template to a downloadable document.

```javascript
// Javascript
const file = await linTO.exportWithTemplate(jobId, { ...options })
```

```python
# Python
file = await linTO.export_with_template(job_id, **options)
```

| Parameter     | required | value  | description                | default value |
| ------------- | -------- | ------ | -------------------------- | ------------- |
| jobId         | yes      | String | Source export job id       |               |
| format        | no       | String | Output format              | "pdf"         |
| templateId    | no       | String | Publication template id    | None          |
| versionNumber | no       | Int    | Template version           | None          |

---

### Taxonomy

A LinTO Studio organization can group media in two complementary ways:

- **Categories & tags**: a category holds a flat list of tags; each conversation can carry any number of tags. The built-in `"tags"` category is the one whose entries surface as chips on media cards.
- **Folders**: a hierarchical tree; each conversation can live in at most one folder.

#### listCategories

List taxonomy categories on the current organization.

```javascript
// Javascript
const categories = await linTO.listCategories()
```

```python
# Python
categories = await linTO.list_categories()
```

#### listTags

List tags inside a category.

```javascript
// Javascript
const tags = await linTO.listTags(categoryId)
```

```python
# Python
tags = await linTO.list_tags(category_id)
```

#### createTag

Create a tag inside a category.

```javascript
// Javascript
const tag = await linTO.createTag(categoryId, name, { ...options })
```

```python
# Python
tag = await linTO.create_tag(category_id, name, **options)
```

| Parameter  | required | value  | description    | default value |
| ---------- | -------- | ------ | -------------- | ------------- |
| categoryId | yes      | String | Parent category|               |
| name       | yes      | String | Tag name       |               |
| color      | no       | String | Hex color      | None          |
| emoji      | no       | String | Unicode emoji  | None          |

#### ensureTag

Return the id of tag `name`, creating it if needed. Defaults to the built-in `"tags"` category, falling back to the first available category if the named one is missing. Returns `null` when no category exists at all.

```javascript
// Javascript
const tagId = await linTO.ensureTag("important")
await linTO.addConversationTag(conversationId, tagId)
```

```python
# Python
tag_id = await linTO.ensure_tag("important")
await linTO.add_conversation_tag(conversation_id, tag_id)
```

| Parameter    | required | value  | description                                          | default value |
| ------------ | -------- | ------ | ---------------------------------------------------- | ------------- |
| name         | yes      | String | Tag name (case-insensitive lookup)                   |               |
| categoryName | no       | String | Category to look into                                | "tags"        |
| color        | no       | String | Color used if the tag has to be created              | None          |
| emoji        | no       | String | Emoji used if the tag has to be created              | None          |

#### addConversationTag

Append a tag to a conversation, preserving existing tags.

```javascript
// Javascript
await linTO.addConversationTag(conversationId, tagId)
```

```python
# Python
await linTO.add_conversation_tag(conversation_id, tag_id)
```

#### listFolders

List folders on the current organization.

```javascript
// Javascript
const folders = await linTO.listFolders()
```

```python
# Python
folders = await linTO.list_folders()
```

#### createFolder

Create a folder.

```javascript
// Javascript
const folder = await linTO.createFolder(name, { ...options })
```

```python
# Python
folder = await linTO.create_folder(name, **options)
```

| Parameter  | required | value                  | description                                          | default value |
| ---------- | -------- | ---------------------- | ---------------------------------------------------- | ------------- |
| name       | yes      | String                 | Folder name                                          |               |
| parentId   | no       | String                 | Parent folder id (root if omitted)                   | None          |
| color      | no       | String                 | Hex color                                            | None          |
| emoji      | no       | String                 | Unicode emoji                                        | None          |
| visibility | no       | `"public"` / `"private"` | Folder visibility for members below MAINTAINER      | "public"      |

#### ensureFolder

Return the id of folder `name`, creating it if needed. Matches on `(name, parentId)` so the same name at different levels stays distinct. With `visibility: "private"`, the service account becomes the owner and moved conversations are hidden from members below MAINTAINER.

```javascript
// Javascript
const folderId = await linTO.ensureFolder(name, { ...options })
```

```python
# Python
folder_id = await linTO.ensure_folder(name, **options)
```

| Parameter  | required | value                  | description                                          | default value |
| ---------- | -------- | ---------------------- | ---------------------------------------------------- | ------------- |
| name       | yes      | String                 | Folder name                                          |               |
| parentId   | no       | String                 | Match within this parent folder (root if omitted)    | None          |
| visibility | no       | `"public"` / `"private"` | Visibility used if the folder has to be created     | "public"      |

#### moveToFolder

Move a conversation into a folder.

```javascript
// Javascript
await linTO.moveToFolder(folderId, conversationId)
```

```python
# Python
await linTO.move_to_folder(folder_id, conversation_id)
```

---

### Sharing & users

#### shareConversation

Share a conversation with a user by email. By default LinTO Studio sends a notification email — pass `notify: false` to suppress it.

```javascript
// Javascript
await linTO.shareConversation(conversationId, email, { ...options })
```

```python
# Python
await linTO.share_conversation(conversation_id, email, **options)
```

| Parameter      | required | value  | description                              | default value |
| -------------- | -------- | ------ | ---------------------------------------- | ------------- |
| conversationId | yes      | String | Target conversation id                   |               |
| email          | yes      | String | Recipient email                          |               |
| right          | no       | Int    | Permission bitmask (1 = read)            | 1             |
| notify         | no       | Bool   | Send notification email                  | True          |

#### searchUsers

Search users by email or display name. Mostly useful as a building block for higher-level helpers like `setConversationOwner`.

```javascript
// Javascript
const users = await linTO.searchUsers(search)
```

```python
# Python
users = await linTO.search_users(search)
```

#### updateConversation

Patch arbitrary conversation fields (e.g. `owner`, `sharedWithUsers`, `tags`). Mostly useful as a building block — prefer the specialized helpers when one exists.

```javascript
// Javascript
await linTO.updateConversation(conversationId, { owner: userId, tags: [tagId] })
```

```python
# Python
await linTO.update_conversation(conversation_id, {"owner": user_id, "tags": [tag_id]})
```

#### setConversationOwner

Transfer conversation ownership to the user matching `email`. Resolves the user via `searchUsers`, then sets `owner` and clears `sharedWithUsers`. Returns the resolved user id, or `null` if the email cannot be matched.

```javascript
// Javascript
const userId = await linTO.setConversationOwner(conversationId, "alice@example.com")
if (!userId) console.warn("user not found")
```

```python
# Python
user_id = await linTO.set_conversation_owner(conversation_id, "alice@example.com")
if not user_id:
    print("user not found")
```

---

### Media output

The object emitted on the `done` event of `transcribe` exposes the helpers below.

| Property / method | description                                                                          |
| ----------------- | ------------------------------------------------------------------------------------ |
| `fullText`        | Plain text of the full transcript (no speaker, language or timestamp metadata).       |
| `turns`           | Array of `{ speaker, lang, text, stime, etime }` objects.                            |
| `response`        | Raw API response (escape hatch for fields the SDK doesn't surface).                  |
| `toFormat(opts)`  | Render the transcript as a single string with configurable metadata and separators.  |

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
