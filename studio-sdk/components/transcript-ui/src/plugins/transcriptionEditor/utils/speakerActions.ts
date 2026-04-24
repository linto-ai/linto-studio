import type { Editor } from "@tiptap/vue-3"
import type { Core } from "../../../core/types"
import { SPEAKER_COLORS } from "../../../constants/speakers"

export interface RenameSpeakerOrigin {
  type: "speaker:rename"
  speakerId: string
  from: string
  to: string
}

export interface ReassignTurnOrigin {
  type: "turn:reassign"
  turnId: string
  from: string | null
  to: string
}

export interface CreateAndAssignOrigin {
  type: "speaker:create-and-assign"
  speakerId: string
  name: string
  turnId: string
}

export interface MergeSpeakersOrigin {
  type: "speaker:merge"
  from: string
  to: string
  affectedTurnIds: string[]
}

export type SpeakerActionOrigin =
  | RenameSpeakerOrigin
  | ReassignTurnOrigin
  | CreateAndAssignOrigin
  | MergeSpeakersOrigin

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
    const origin: RenameSpeakerOrigin = {
      type: "speaker:rename",
      speakerId,
      from: existing.name,
      to: trimmed,
    }
    map.doc.transact(() => {
      const cur = map.get(speakerId)
      if (!cur) return
      map.set(speakerId, { ...cur, name: trimmed })
    }, origin)
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

  const origin: ReassignTurnOrigin = {
    type: "turn:reassign",
    turnId,
    from: currentSpeakerId,
    to: newSpeakerId,
  }
  const ydoc = core.transcriptionEditor?.doc
  const apply = () => {
    const tr = editor.state.tr.setNodeAttribute(pos, "speakerId", newSpeakerId)
    editor.view.dispatch(tr)
  }
  if (ydoc) ydoc.transact(apply, origin)
  else apply()
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
  const color = pickColor(core)
  const origin: CreateAndAssignOrigin = {
    type: "speaker:create-and-assign",
    speakerId: newId,
    name: trimmed,
    turnId,
  }
  ydoc.transact(() => {
    map.set(newId, { name: trimmed, color })
    const tr = editor.state.tr.setNodeAttribute(pos, "speakerId", newId)
    editor.view.dispatch(tr)
  }, origin)
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
  const origin: MergeSpeakersOrigin = {
    type: "speaker:merge",
    from: fromSpeakerId,
    to: toSpeakerId,
    affectedTurnIds: hits.map((h) => h.turnId),
  }
  ydoc.transact(() => {
    if (hits.length > 0) {
      let tr = editor.state.tr
      for (const hit of hits) {
        tr = tr.setNodeAttribute(hit.pos, "speakerId", toSpeakerId)
      }
      editor.view.dispatch(tr)
    }
    map.delete(fromSpeakerId)
  }, origin)
}
