import { createLLMServicesPlugin } from "@linto-ai/transcript-ui-webcomponent"
import { loadCatalog } from "./actions/loadCatalog.js"
import { followActiveTrack } from "./actions/followActiveTrack.js"
import { RegenerationsInFlight } from "./RegenerationsInFlight.js"

// Drives the summary part of transcript-ui: the reports (LLM services) of
// the followed track, the displayed one or the source of the cross view.
// The catalog of services is the same for every track and loaded once;
// everything tied to a track lives in a TrackSummary, recreated when the
// followed track changes.
//
// The plugin belongs to the core once installed (released by its own
// destroy): destroy() releases the listener and the track summary.
export class SummaryController {
  constructor(
    core,
    {
      organizationId,
      securityLevel,
      socket,
      locale,
      t,
      notify,
      openPublication,
    },
  ) {
    this.core = core
    this.organizationId = organizationId
    this.securityLevel = securityLevel
    this.socket = socket
    this.locale = locale
    this.t = t
    this.notify = notify
    this.openPublication = openPublication
    this.destroyed = false
    // Report id → what the gateway calls need (see buildReportCatalogEntry)
    this.catalog = new Map()
    this.regenerations = new RegenerationsInFlight()
    this.trackSummary = null
    core.use(createLLMServicesPlugin())
    // Never rejects: a track summary waits for it before reading the catalog
    this.catalogLoaded = loadCatalog(this)
    this.offActiveTrackChange = core.on("activeTrack:change", () =>
      this.followActiveTrack(),
    )
    this.followActiveTrack()
  }

  followActiveTrack() {
    followActiveTrack(this)
  }

  destroy() {
    this.destroyed = true
    this.offActiveTrackChange()
    this.trackSummary?.destroy()
    this.trackSummary = null
  }
}
