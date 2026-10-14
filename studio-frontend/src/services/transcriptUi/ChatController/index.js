import { enableIfAvailable } from "./actions/enableIfAvailable.js"
import { followActiveTrack } from "./actions/followActiveTrack.js"

// Drives the chat part of transcript-ui: the discussions about the followed
// track, the displayed one or the source of the cross view. The chat is
// offered once the backend says it is available; the capabilities (set by
// the host) say whether the reader may use it. Everything tied to a track
// lives in a TrackChat, recreated when the followed track changes.
//
// The plugin belongs to the core once installed (released by its own
// destroy): destroy() releases the listener and the track chat.
export class ChatController {
  constructor(core, { t }) {
    this.core = core
    this.t = t
    this.destroyed = false
    this.trackChat = null
    this.offActiveTrackChange = null
    enableIfAvailable(this)
  }

  followActiveTrack() {
    followActiveTrack(this)
  }

  destroy() {
    this.destroyed = true
    this.offActiveTrackChange?.()
    this.trackChat?.destroy()
    this.trackChat = null
  }
}
