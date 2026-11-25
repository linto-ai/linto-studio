import test from "ava"
import { buildRecordingRequest } from "../buildRecordingRequest.ts"

const transcription = {
  serviceName: "whisper",
  endpoint: "stt/transcribe",
  lang: "fr-FR",
  transcriptionConfig: { language: "fr-FR" },
  speakerIdentificationCollections: ["c1"],
}

test("buildRecordingRequest() completes the settings for the sending", (t) => {
  const file = new File(["a"], "Meeting.webm")
  const request = buildRecordingRequest(
    { name: "Meeting" },
    { transcription, sharing: { membersRight: 3, folderId: null } },
    file,
  )
  t.is(request.name, "Meeting")
  t.is(request.description, "")
  t.is(request.securityLevel, 0)
  t.is(request.serviceName, "whisper")
  t.is(request.transcriptionConfig, '{"language":"fr-FR"}')
  t.deepEqual(request.speakerIdentificationCollections, ["c1"])
  t.is(request.membersRight, 3)
  t.is(request.folderId, undefined)
  t.deepEqual(request.tracks, [file])
})

test("buildRecordingRequest() sends the folder when there is one", (t) => {
  const request = buildRecordingRequest(
    { name: "Meeting" },
    { transcription, sharing: { membersRight: 3, folderId: "f1" } },
    new File(["a"], "Meeting.webm"),
  )
  t.is(request.folderId, "f1")
})
