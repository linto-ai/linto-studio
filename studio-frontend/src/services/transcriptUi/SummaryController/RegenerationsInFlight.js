// The generation requests in flight, per track. Kept by the controller: a
// request outlives the TrackSummary that sent it when the followed track
// changes and comes back, and the server may not list its job yet.
export class RegenerationsInFlight {
  constructor() {
    // Track id → report ids
    this.reportIdsByTrack = new Map()
  }

  add(trackId, id) {
    const reportIds = this.reportIdsByTrack.get(trackId) ?? new Set()
    reportIds.add(id)
    this.reportIdsByTrack.set(trackId, reportIds)
  }

  delete(trackId, id) {
    const reportIds = this.reportIdsByTrack.get(trackId)
    reportIds?.delete(id)
    if (reportIds?.size === 0) this.reportIdsByTrack.delete(trackId)
  }

  has(trackId, id) {
    return this.reportIdsByTrack.get(trackId)?.has(id) ?? false
  }

  list(trackId) {
    return [...(this.reportIdsByTrack.get(trackId) ?? [])]
  }
}
