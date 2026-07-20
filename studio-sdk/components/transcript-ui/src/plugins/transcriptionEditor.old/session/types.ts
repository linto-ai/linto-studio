import type { Doc } from "yjs"
import type { Editor } from "@tiptap/vue-3"

import type { Core, TurnStore, YjsUser } from "../../../core/types"
import type { DebugFlags, FlightRecorder } from "../debug/syncFlightRecorder"

export interface CollabOptions {
  /** Hocuspocus WebSocket URL (e.g. "ws://localhost/ws/editor") */
  url: string
  /** JWT token for authentication */
  token: string
  /**
   * Editor epoch per turn-store id (= conversation id), as fetched from the
   * API. The epoch identifies the server-side CRDT history lineage and is
   * appended to the Hocuspocus document name; the server rejects connections
   * whose epoch is stale (history rebuilt after an external write).
   * Missing entry defaults to 0.
   */
  epochs?: Record<string, number>
  /**
   * Called when the server rejects the connection at authentication —
   * invalid/expired token, lost access, or stale epoch. For a stale epoch
   * the host should refetch the document (fresh epochs) and reload it.
   */
  onAuthenticationFailed?: (reason: string) => void
}

export interface LocalUser {
  name: string
  color: string
  [key: string]: unknown
}

/**
 * Plugin-side surface a session publishes its reactive state through.
 * The plugin owns the state (refs stay stable across session restarts);
 * sessions only push into it.
 */
export interface SessionHost {
  setEditor(editor: Editor | undefined): void
  setConnected(connected: boolean): void
  setUsers(users: YjsUser[]): void
  /** Local collaborator identity; plugin-owned so it survives restarts. */
  readonly user: LocalUser
}

export interface SessionDeps {
  core: Core
  host: SessionHost
  /** The turn store this session edits — fixed for its lifetime. */
  turnStore: TurnStore
  field: string
  readOnly: boolean
  /** Sync-crash instrumentation; both null unless the debug flag is on. */
  debugFlags: DebugFlags
  recorder: FlightRecorder | null
}

/** A session owns the resources bound to one turn store: a Y.Doc, an
 *  optional provider, a Tiptap editor. destroy() releases all of them. */
export interface EditorSession {
  readonly ydoc: Doc
  /** Broadcast the (already updated) host.user to remote participants. */
  updateUser(): void
  destroy(): void
}
