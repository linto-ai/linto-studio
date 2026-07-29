// Gateway version payload: { version_number, created_at, ... }
// SDK core shape:           { versionNumber, createdAt }  (createdAt = epoch ms)

export function mapVersion(apiVersion) {
  if (!apiVersion) return null
  const versionNumber = Number(apiVersion.version_number)
  if (!Number.isFinite(versionNumber)) return null

  const ts = new Date(apiVersion.created_at).getTime()
  return {
    versionNumber,
    createdAt: Number.isFinite(ts) ? ts : Date.now(),
  }
}

export function mapVersions(apiVersions) {
  if (!Array.isArray(apiVersions)) return []
  const out = []
  for (const v of apiVersions) {
    const mapped = mapVersion(v)
    if (mapped) out.push(mapped)
  }
  return out
}
