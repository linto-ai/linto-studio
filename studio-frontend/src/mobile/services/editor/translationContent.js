import { apiGetConversationById } from "@/api/conversation"

// A translation's content (turns + speakers) lives in its child
// conversation and is fetched lazily, once per track. Same contract as the
// classic editor page.

export async function loadActiveTranslation(core, mapApiTurns) {
  const channel = core.activeChannel?.value
  if (!channel) return
  const translation = channel.translations.get(
    channel.activeTranslation.value.id,
  )
  if (!translation || translation.turns.value.length > 0) return
  await fetchTranslationContent(core, channel, translation, mapApiTurns)
}

export async function refetchTranslation(core, translationId, mapApiTurns) {
  for (const channel of core.channels.values()) {
    const translation = channel.translations.get(translationId)
    if (translation) {
      await fetchTranslationContent(core, channel, translation, mapApiTurns)
      return
    }
  }
}

async function fetchTranslationContent(
  core,
  channel,
  translation,
  mapApiTurns,
) {
  channel.isLoadingHistory.value = true
  try {
    const conversation = await apiGetConversationById(
      translation.id,
      ["text", "speakers", "editorVersion"].toString(),
    )
    if (!conversation) return
    for (const speaker of conversation.speakers ?? []) {
      core.speakers.ensure(speaker.speaker_id, speaker.speaker_name)
    }
    translation.setTurns(mapApiTurns(conversation.text ?? []))
    core.transcriptionEditor?.setTranslationVersion(
      translation.id,
      conversation.editorVersion ?? 0,
    )
    channel.hasMoreHistory.value = false
  } catch (error) {
    console.error("cannot load translation content", error)
  } finally {
    channel.isLoadingHistory.value = false
  }
}
