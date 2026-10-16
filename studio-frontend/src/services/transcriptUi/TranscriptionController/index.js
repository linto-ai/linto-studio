import { VERBATIM_FORMATS } from "@/const/verbatimFormats.js"
import { buildAudioPlugin } from "./buildAudioPlugin.js"
import { buildTranscriptionEditorPlugin } from "./buildTranscriptionEditorPlugin.js"
import { buildEditorRoomHandlers } from "./buildEditorRoomHandlers.js"
import { createSpeakerLabels } from "./createSpeakerLabels.js"
import { loadActiveTrackContent } from "./actions/loadActiveTrackContent.js"
import { refetchTrack } from "./actions/refetchTrack.js"
import { exportVerbatim } from "./actions/exportVerbatim.js"

// Drives the transcription part of transcript-ui for one conversation:
// track contents, audio, the lock + save editing protocol and the verbatim
// downloads. The editing
// plugin and the room are set up in read only mode too: a reader sees the
// changes of the others live, the capabilities hide the editing.
//
// The plugins belong to the core once installed (released by its own
// destroy): destroy() releases the room and the listeners.
export class TranscriptionController {
  constructor(core, { conversationId, conversationName, socket, t, notify }) {
    this.core = core
    // Title and file name of the verbatim downloads
    this.conversationName = conversationName
    this.socket = socket
    this.t = t
    this.notify = notify
    this.destroyed = false
    this.speakerLabels = createSpeakerLabels(t)
    // Track id → its load in progress (see loadTrackContent)
    this.pendingTrackLoads = new Map()
    // Channel id → number of its tracks loading
    this.pendingLoadsByChannel = new Map()
    core.use(buildAudioPlugin())
    core.use(
      buildTranscriptionEditorPlugin(socket, (trackId) =>
        this.refetchTrack(trackId),
      ),
    )
    core.verbatimFormats.value = VERBATIM_FORMATS
    socket.joinEditorRoom(
      conversationId,
      buildEditorRoomHandlers(core, this.speakerLabels),
    )
    this.offActiveTrackChange = core.on("activeTrack:change", () =>
      this.loadActiveTrackContent(),
    )
    this.offVerbatimExport = core.on("verbatim:export", ({ format }) =>
      this.exportVerbatim(format),
    )
    this.loadActiveTrackContent()
  }

  loadActiveTrackContent() {
    return loadActiveTrackContent(this)
  }

  refetchTrack(trackId) {
    return refetchTrack(this, trackId)
  }

  exportVerbatim(format) {
    return exportVerbatim(this, format)
  }

  destroy() {
    this.destroyed = true
    this.offActiveTrackChange()
    this.offVerbatimExport()
    this.socket.leaveEditorRoom()
  }
}
