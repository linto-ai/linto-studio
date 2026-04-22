import type { Doc, YMapEvent } from "yjs"
import type { Core } from "../../../core/types"
import type { Speaker } from "../../../types/editor"
import type { TranslationStore } from "../../../core/types"
import { speakerEquals } from "../../../core/helpers/speakerEquals"

export const SPEAKERS_MAP_KEY = "speakers"

export interface SpeakerData {
  name: string
  color: string
}

export interface SetupSpeakersSyncOptions {
  core: Core
  ydoc: Doc
  translation: TranslationStore
  /** When true, seed the Y.Map from core.speakers for speakers referenced
   *  by the translation's turns (local mode only). In collab mode the server seeds. */
  seedFromCore: boolean
}

/**
 * Wires bidirectional sync between core.speakers (Vue store) and a Y.Map
 * of speakers scoped to a translation's Y.Doc. Returns a cleanup function.
 */
export function setupSpeakersSync(
  options: SetupSpeakersSyncOptions,
): () => void {
  const { core, ydoc, translation, seedFromCore } = options
  const speakersMap = ydoc.getMap<SpeakerData>(SPEAKERS_MAP_KEY)

  if (seedFromCore) {
    const used = new Set<string>()
    for (const turn of translation.turns.value) {
      if (turn.speakerId) used.add(turn.speakerId)
    }
    ydoc.transact(() => {
      for (const id of used) {
        if (speakersMap.has(id)) continue
        const speaker = core.speakers.all.get(id)
        if (speaker) {
          speakersMap.set(id, { name: speaker.name, color: speaker.color })
        }
      }
    })
  }

  for (const [id, data] of speakersMap.entries()) {
    core.speakers.updateOrCreate({ id, name: data.name, color: data.color })
  }

  const observer = (event: YMapEvent<SpeakerData>) => {
    event.changes.keys.forEach((change, id) => {
      if (change.action === "delete") {
        core.speakers.delete(id)
      } else {
        const data = speakersMap.get(id)
        if (!data) return
        core.speakers.updateOrCreate({ id, name: data.name, color: data.color })
      }
    })
  }
  speakersMap.observe(observer)

  const writeToY = (speaker: Speaker) => {
    const cur = speakersMap.get(speaker.id)
    if (cur && speakerEquals(cur, speaker)) return
    speakersMap.set(speaker.id, { name: speaker.name, color: speaker.color })
  }

  const offAdd = core.on("speaker:add", ({ speaker }) => writeToY(speaker))
  const offUpdate = core.on("speaker:update", ({ speaker }) => writeToY(speaker))
  const offRemove = core.on("speaker:remove", ({ speakerId }) => {
    speakersMap.delete(speakerId)
  })

  return () => {
    speakersMap.unobserve(observer)
    offAdd()
    offUpdate()
    offRemove()
  }
}
