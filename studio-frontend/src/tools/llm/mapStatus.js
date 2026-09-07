// Gateway emits "started" for in-progress jobs; the SDK core expects
// "processing". Other status values pass through unchanged.

export function mapStatus(status) {
  return status === "started" ? "processing" : status
}
