import { enableIfAvailable } from "./actions/enableIfAvailable.js"
import { followActiveTrack } from "./actions/followActiveTrack.js"

// Drives the chat part of transcript-ui: the discussions about the followed
// track, the displayed one or the source of the cross view. The chat is
// offered once the backend says it is available; the capabilities (set by
// the host) say whether the reader may use it. Everything tied to a track is
// a ChatIntegration (services/chatIntegration), recreated when the followed
// track changes.
//
// The plugin belongs to the core once installed (released by its own
// destroy): destroy() releases the listener and the chat integration.
export class ChatController {
  constructor(core, { t, notify, isOrganizationAdmin, openUpgradeModal }) {
    this.core = core
    // Host dependencies of the ChatIntegration of each track
    this.integrationOptions = {
      t,
      notify,
      isOrganizationAdmin,
      openUpgradeModal,
    }
    this.destroyed = false
    this.chatIntegration = null
    this.offActiveTrackChange = null
    enableIfAvailable(this)
  }

  followActiveTrack() {
    followActiveTrack(this)
  }

  destroy() {
    this.destroyed = true
    this.offActiveTrackChange?.()
    this.chatIntegration?.dispose()
    this.chatIntegration = null
  }
}
