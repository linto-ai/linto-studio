import { apiGetConversationChild } from "@/api/conversation.js"
import { apiGetCanonicalConv } from "./apiGetCanonicalConv.js"

function sourceTranslation(conv) {
  return {
    id: conv._id,
    isSource: true,
    audio: conv?.metadata?.audio?.filename,
    languages: [conv.locale],
    turns: [],
  }
}

function translation(conv) {
  return {
    id: conv._id,
    isSource: false,
    languages: [conv.locale],
    turns: [],
  }
}

function channel(conv, translations) {
  return {
    id: conv._id,
    name: conv.name,
    duration: conv?.metadata?.audio?.duration ?? 0,
    translations,
  }
}

export async function apiGetConversationAsDoc(convId) {
  const canonical = await apiGetCanonicalConv(convId)

  // no children: one channel, no translations
  if (canonical.type.child_conversations.length === 0) {
    return {
      title: canonical.name,
      speakers: new Map(),
      channels: [channel(canonical, [sourceTranslation(canonical)])],
    }
  }

  const childs = await apiGetConversationChild(canonical._id, [
    "_id",
    "name",
    "type.mode",
    "locale",
    "metadata.transcription",
    "jobs.transcription.state",
  ])

  let channels

  switch (childs[0].type.mode) {
    case "child":
      // multiple channels, each may have its own translations
      channels = await Promise.all(
        childs.map(async (child) => {
          const childTranslations = await apiGetConversationChild(child._id, [
            "_id",
            "locale",
          ])
          return channel(child, [
            sourceTranslation(child),
            ...childTranslations.map(translation),
          ])
        }),
      )
      break

    case "translation":
      // one channel, with translations
      channels = [
        channel(canonical, [
          sourceTranslation(canonical),
          ...childs.map(translation),
        ]),
      ]
      break
  }

  return {
    title: canonical.name,
    speakers: new Map(),
    channels,
  }
}
