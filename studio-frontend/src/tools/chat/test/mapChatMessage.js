import test from "ava"
import { mapChatMessage } from "../mapChatMessage.js"

test("mapChatMessage() maps an API message", (t) => {
  t.deepEqual(
    mapChatMessage(
      {
        _id: "m1",
        role: "assistant",
        content: "Bonjour",
        created_at: "2026-10-14T10:00:00Z",
        tokenCount: 12,
      },
      0,
    ),
    {
      id: "m1",
      role: "assistant",
      content: "Bonjour",
      createdAt: Date.parse("2026-10-14T10:00:00Z"),
      tokenCount: 12,
    },
  )
})

test("mapChatMessage() gives a message without id one from its position", (t) => {
  const message = mapChatMessage({ role: "user", content: "Hi" }, 3)
  t.is(message.id, "user-3")
  t.is(message.createdAt, undefined)
})
