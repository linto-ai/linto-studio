import type { Doc, Map as YMap, YMapEvent } from "yjs"
import type { Core, SpeakersStore, TurnStore } from "../../../core/types"
import type { Speaker } from "../../../types/editor"
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

/**
 * Seed the Y.Map from core speakers referenced by the store's turns.
 * Local mode only — in collab mode the server seeds the map.
 */
export function seedSpeakersMap(
  ydoc: Doc,
  turnStore: TurnStore,
  speakers: SpeakersStore,
): void {
  const speakersMap = ydoc.getMap<SpeakerData>(SPEAKERS_MAP_KEY)

  const used = new Set<string>()
  for (const turn of turnStore.turns.value) {
    if (turn.speakerId) used.add(turn.speakerId)
  }

  ydoc.transact(() => {
    for (const id of used) {
      if (speakersMap.has(id)) continue
      const speaker = speakers.all.get(id)
      if (speaker) {
        speakersMap.set(id, { name: speaker.name, color: speaker.color })
      }
    }
  })
}

/**
 * Bidirectional sync between core.speakers (Vue store) and the speakers
 * Y.Map of a session's Y.Doc. Construction imports the current Y state
 * into the core; destroy() releases every subscription.
 */
export class SpeakersSync {
  private readonly core: Core
  private readonly speakersMap: YMap<SpeakerData>
  private readonly observer: (event: YMapEvent<SpeakerData>) => void
  private readonly offCoreEvents: Array<() => void>

  constructor(core: Core, ydoc: Doc) {
    this.core = core
    this.speakersMap = ydoc.getMap<SpeakerData>(SPEAKERS_MAP_KEY)

    this.importFromY()

    this.observer = (event) => this.applyYEvent(event)
    this.speakersMap.observe(this.observer)

    this.offCoreEvents = [
      core.on("speaker:add", ({ speaker }) => this.writeToY(speaker)),
      core.on("speaker:update", ({ speaker }) => this.writeToY(speaker)),
      core.on("speaker:remove", ({ speakerId }) =>
        this.speakersMap.delete(speakerId),
      ),
    ]
  }

  destroy(): void {
    this.speakersMap.unobserve(this.observer)
    this.offCoreEvents.forEach((off) => off())
  }

  private importFromY(): void {
    for (const [id, data] of this.speakersMap.entries()) {
      const color = resolveColor(id, data, this.core.speakers.all.get(id))
      this.core.speakers.updateOrCreate({ id, name: data.name, color })
    }
  }

  private applyYEvent(event: YMapEvent<SpeakerData>): void {
    event.changes.keys.forEach((change, id) => {
      if (change.action === "delete") {
        this.core.speakers.delete(id)
        return
      }
      const data = this.speakersMap.get(id)
      if (!data) return
      const color = resolveColor(id, data, this.core.speakers.all.get(id))
      this.core.speakers.updateOrCreate({ id, name: data.name, color })
    })
  }

  // speakerEquals breaks the echo loop: Y → core → speaker:update → Y.
  private writeToY(speaker: Speaker): void {
    const cur = this.speakersMap.get(speaker.id)
    if (cur && speakerEquals(cur, speaker)) return
    this.speakersMap.set(speaker.id, { name: speaker.name, color: speaker.color })
  }
}
