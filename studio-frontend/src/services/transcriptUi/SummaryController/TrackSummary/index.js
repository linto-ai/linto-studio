import { ReportsRoom } from "./ReportsRoom.js"
import { loadReports } from "./actions/loadReports.js"
import { regenerate } from "./actions/regenerate.js"
import { generateIfNeverGenerated } from "./actions/generateIfNeverGenerated.js"
import { exportReport } from "./actions/exportReport.js"
import { selectVersion } from "./actions/selectVersion.js"
import { saveVersion } from "./actions/saveVersion.js"
import { selectGeneration } from "./actions/selectGeneration.js"
import { applyJobUpdate } from "./actions/applyJobUpdate.js"
import { applyJobComplete } from "./actions/applyJobComplete.js"
import { applyJobError } from "./actions/applyJobError.js"

// The reports of one track, a conversation of its own: their jobs, the
// editor's requests about them and the live job updates. Lives as long as
// the track is followed: once destroyed, a pending request drops its result
// instead of writing it over the reports of the next track.
export class TrackSummary {
  constructor(summaryController, trackId) {
    const { core } = summaryController
    this.summaryController = summaryController
    this.core = core
    this.trackId = trackId
    this.destroyed = false
    // Known once the job list of the track is loaded: a failed fetch is not
    // "no job".
    this.jobsLoaded = false
    // Report id → { jobId, generationJobIds }
    this.jobs = new Map()
    // The latest loadReports, the only one allowed to write: an older run
    // still in progress drops its results (see isLoadStale).
    this.currentLoad = null
    this.offRegenerate = core.on("llmService:regenerate", ({ id }) =>
      this.regenerate(id),
    )
    this.offActive = core.on("llmService:active", ({ id }) =>
      this.generateIfNeverGenerated(id),
    )
    this.offExport = core.on("llmService:export", ({ id }) =>
      this.exportReport(id),
    )
    this.offSelectVersion = core.on(
      "llmService:selectVersion",
      ({ id, versionNumber }) => this.selectVersion(id, versionNumber),
    )
    this.offSaveVersion = core.on("llmService:saveVersion", ({ id, content }) =>
      this.saveVersion(id, content),
    )
    this.offSelectGeneration = core.on(
      "llmService:selectGeneration",
      ({ id, generationId }) => this.selectGeneration(id, generationId),
    )
    this.room = new ReportsRoom(
      summaryController.socket.socket,
      {
        organizationId: summaryController.organizationId,
        conversationId: trackId,
      },
      {
        onJobUpdate: (update) => this.applyJobUpdate(update),
        onJobComplete: (update) => this.applyJobComplete(update),
        onJobError: (update) => this.applyJobError(update),
        onReconnect: () => this.loadReports(),
      },
    )
    this.loadReports()
  }

  loadReports() {
    return loadReports(this)
  }

  regenerate(id) {
    return regenerate(this, id)
  }

  // Opening a report that was never generated starts its generation.
  generateIfNeverGenerated(id) {
    generateIfNeverGenerated(this, id)
  }

  exportReport(id) {
    exportReport(this, id)
  }

  selectVersion(id, versionNumber) {
    return selectVersion(this, id, versionNumber)
  }

  saveVersion(id, content) {
    return saveVersion(this, id, content)
  }

  selectGeneration(id, generationId) {
    return selectGeneration(this, id, generationId)
  }

  applyJobUpdate(update) {
    applyJobUpdate(this, update)
  }

  applyJobComplete(update) {
    return applyJobComplete(this, update)
  }

  applyJobError(update) {
    applyJobError(this, update)
  }

  destroy() {
    this.destroyed = true
    this.offRegenerate()
    this.offActive()
    this.offExport()
    this.offSelectVersion()
    this.offSaveVersion()
    this.offSelectGeneration()
    this.room.destroy()
  }
}
