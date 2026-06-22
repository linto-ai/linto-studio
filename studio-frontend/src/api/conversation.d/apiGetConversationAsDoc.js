import { apiGetConversationChild } from "@/api/conversation.js"
import { apiGetCanonicalConv } from "./apiGetCanonicalConv.js"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

function convertLocaleToLanguages(locales) {
  switch (true) {
    case typeof locales === "string":
      return [locales]
      break
    case locales?.length:
      return locales
    default:
      return []
  }
}

function sourceTranslation(conv) {
  const tr = {
    id: conv._id,
    isSource: true,
    languages: convertLocaleToLanguages(conv.locale),
    turns: [],
    // Editor CRDT history lineage id, consumed by the collab plugin
    // (appended to the Hocuspocus document name). Not editor-model data.
    editorEpoch: conv.editorEpoch ?? 0,
  }
  if (conv?.metadata?.audio) {
    tr.audio = {
      src: conv._id,
      filename: conv.metadata.audio.filename,
    }
  }
  return tr
}

function translation(conv) {
  return {
    id: conv._id,
    isSource: false,
    languages: [conv.locale],
    turns: [],
    editorEpoch: conv.editorEpoch ?? 0,
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

function buildResult(canonical, doc) {
  return {
    doc,
    name: canonical.name,
    organizationId: canonical.organization?.organizationId ?? null,
    securityLevel: canonical.securityLevel ?? null,
  }
}

export async function apiGetConversationAsDoc(convId) {
  const canonical = await apiGetCanonicalConv(convId)

  // no children: one channel, no translations
  if (canonical.type.child_conversations.length === 0) {
    return buildResult(canonical, {
      title: canonical.name,
      speakers: new Map(),
      channels: [channel(canonical, [sourceTranslation(canonical)])],
    })
  }

  const childs = await apiGetConversationChild(canonical._id, [
    "_id",
    "name",
    "type.mode",
    "locale",
    "metadata.transcription",
    "jobs.transcription.state",
    "editorEpoch",
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
            "editorEpoch",
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

  return buildResult(canonical, {
    title: canonical.name,
    speakers: new Map(),
    channels,
  })
}
