import type { Editor } from "@tiptap/vue-3"
import type { Core } from "../../../core/types"
import { SPEAKER_COLORS } from "../../../constants/speakers"
import { KEEP_IN_HISTORY } from "./historyPolicy"

function pickColor(core: Core): string {
  const size = core.speakers.all.size
  return SPEAKER_COLORS[size % SPEAKER_COLORS.length]!
}

function findTurnPos(editor: Editor, turnId: string): number | null {
  let found: number | null = null
  editor.state.doc.descendants((node, pos) => {
    if (found !== null) return false
    if (node.type.name === "turn" && node.attrs.id === turnId) {
      found = pos
      return false
    }
  })
  return found
}

function findTurnPositionsBySpeaker(
  editor: Editor,
  speakerId: string,
): Array<{ pos: number; turnId: string; attrs: Record<string, unknown> }> {
  const hits: Array<{ pos: number; turnId: string; attrs: Record<string, unknown> }> = []
  editor.state.doc.descendants((node, pos) => {
    if (node.type.name === "turn" && node.attrs.speakerId === speakerId) {
      hits.push({ pos, turnId: node.attrs.id, attrs: { ...node.attrs } })
    }
  })
  return hits
}

export function countTurnsForSpeaker(editor: Editor, speakerId: string): number {
  return findTurnPositionsBySpeaker(editor, speakerId).length
}

export function renameSpeaker(
  core: Core,
  speakerId: string,
  newName: string,
): void {
  const trimmed = newName.trim()
  const existing = core.speakers.all.get(speakerId)
  if (!existing || !trimmed || trimmed === existing.name) return

  const map = core.transcriptionEditor?.speakersMap
  if (map && map.doc) {
    map.doc.transact(() => {
      const cur = map.get(speakerId)
      if (!cur) return
      map.set(speakerId, { ...cur, name: trimmed })
    })
  } else {
    core.speakers.update(speakerId, { name: trimmed })
  }
}

export function switchTurnSpeaker(
  core: Core,
  turnId: string,
  newSpeakerId: string,
): void {
  const editor = core.transcriptionEditor?.tiptapEditor.value
  if (!editor) return
  const pos = findTurnPos(editor, turnId)
  if (pos === null) return
  const currentSpeakerId = editor.state.doc.nodeAt(pos)?.attrs.speakerId ?? null
  if (currentSpeakerId === newSpeakerId) return

  // Dispatch straight through ySync — never nested in ydoc.transact, which would
  // defeat ySync's echo-suppression and force a whole-document re-render.
  // Tagged keepInHistory so reassigning a turn's speaker is undoable.
  editor.view.dispatch(
    editor.state.tr
      .setNodeAttribute(pos, "speakerId", newSpeakerId)
      .setMeta(KEEP_IN_HISTORY, true),
  )
}

export function createSpeakerAndAssign(
  core: Core,
  turnId: string,
  name: string,
): string | null {
  const trimmed = name.trim()
  if (!trimmed) return null
  const editor = core.transcriptionEditor?.tiptapEditor.value
  const map = core.transcriptionEditor?.speakersMap
  const ydoc = core.transcriptionEditor?.doc
  if (!editor || !map || !ydoc) return null
  const pos = findTurnPos(editor, turnId)
  if (pos === null) return null

  const newId = crypto.randomUUID()
  // Create the speaker in the map first, then point the turn at it through
  // ySync — two separate top-level writes so the PM dispatch is never nested in
  // ydoc.transact. Not tagged keepInHistory: creating a speaker mutates the
  // speakers map, which the editor's undo history doesn't cover.
  ydoc.transact(() => map.set(newId, { name: trimmed, color: pickColor(core) }))
  editor.view.dispatch(editor.state.tr.setNodeAttribute(pos, "speakerId", newId))
  return newId
}

export function mergeSpeakers(
  core: Core,
  fromSpeakerId: string,
  toSpeakerId: string,
): void {
  if (fromSpeakerId === toSpeakerId) return
  const editor = core.transcriptionEditor?.tiptapEditor.value
  const map = core.transcriptionEditor?.speakersMap
  const ydoc = core.transcriptionEditor?.doc
  if (!editor || !map || !ydoc) return
  if (!map.has(fromSpeakerId) || !map.has(toSpeakerId)) return

  const hits = findTurnPositionsBySpeaker(editor, fromSpeakerId)
  // Point every affected turn at the surviving speaker (through ySync, not
  // nested in ydoc.transact), THEN drop the merged-away speaker — in that order,
  // so no turn ever references a deleted speaker. Not tagged keepInHistory:
  // merging mutates the speakers map, outside the editor's undo history.
  if (hits.length > 0) {
    let tr = editor.state.tr
    for (const hit of hits) {
      tr = tr.setNodeAttribute(hit.pos, "speakerId", toSpeakerId)
    }
    editor.view.dispatch(tr)
  }
  ydoc.transact(() => map.delete(fromSpeakerId))
}
