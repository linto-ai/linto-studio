const KINDS = Object.freeze({
  live: { kind: "live", icon: "broadcast" },
  file: { kind: "file", icon: "waveform" },
})

/**
 * Where a conversation comes from: a live session (type.from_session_id)
 * or an uploaded / recorded file.
 * @param {{ type?: { from_session_id?: string } }} media
 * @returns {{ kind: "live" | "file", icon: string }}
 */
export function describeMediaKind(media) {
  return media?.type?.from_session_id ? KINDS.live : KINDS.file
}
