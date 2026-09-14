import test from "ava"
import { buildStudioConversationUrl } from "../buildStudioConversationUrl.js"

test("buildStudioConversationUrl() targets the classic transcription page", (t) => {
  t.is(
    buildStudioConversationUrl("org1", "conv1"),
    "/interface/org1/conversations/conv1/transcription",
  )
})

test("buildStudioConversationUrl() escapes ids", (t) => {
  t.is(
    buildStudioConversationUrl("o/1", "c 1"),
    "/interface/o%2F1/conversations/c%201/transcription",
  )
})
