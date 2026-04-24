import type { Doc, YMapEvent } from "yjs"
import type { Core } from "../../../core/types"
import type { Speaker } from "../../../types/editor"
import type { TranslationStore } from "../../../core/types"
import { speakerEquals } from "../../../core/helpers/speakerEquals"
import { SPEAKER_COLORS } from "../../../constants/speakers"

export const SPEAKERS_MAP_KEY = "speakers"

/** Color may be absent when the server seeded the Y.Map (server doesn't persist colors). */
export interface SpeakerData {
  name: string
  color?: string
}

function fallbackColor(speakerId: string): string {
  let h = 5381
  for (let i = 0; i < speakerId.length; i++) {
    h = ((h << 5) + h) ^ speakerId.charCodeAt(i)
  }
  return SPEAKER_COLORS[(h >>> 0) % SPEAKER_COLORS.length]!
}

function resolveColor(
  id: string,
  data: SpeakerData,
  existing: Speaker | undefined,
): string {
  return data.color ?? existing?.color ?? fallbackColor(id)
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
    const color = resolveColor(id, data, core.speakers.all.get(id))
    core.speakers.updateOrCreate({ id, name: data.name, color })
  }

  const observer = (event: YMapEvent<SpeakerData>) => {
    event.changes.keys.forEach((change, id) => {
      if (change.action === "delete") {
        core.speakers.delete(id)
      } else {
        const data = speakersMap.get(id)
        if (!data) return
        const color = resolveColor(id, data, core.speakers.all.get(id))
        core.speakers.updateOrCreate({ id, name: data.name, color })
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
