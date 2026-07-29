import { mapStatus } from "./mapStatus.js"

// Backend generation payload:
//   { generationId, jobId, createdAt, serviceId, serviceName, status, isCurrent }
// SDK core shape (subset, no jobId/serviceName/isCurrent — those stay
// host-only): { generationId, createdAt: epoch ms, status }
//
// Allowed core statuses: "completed" | "error" | "processing" | "queued".
// `mapStatus` already translates "started" → "processing".

const ALLOWED = new Set(["completed", "error", "processing", "queued"])

export function mapGeneration(apiGeneration) {
  if (!apiGeneration || !apiGeneration.generationId) return null
  const ts = new Date(apiGeneration.createdAt).getTime()
  const status = mapStatus(apiGeneration.status)
  return {
    generationId: String(apiGeneration.generationId),
    createdAt: Number.isFinite(ts) ? ts : Date.now(),
    status: ALLOWED.has(status) ? status : "completed",
  }
}

export function mapGenerations(apiGenerations) {
  if (!Array.isArray(apiGenerations)) return []
  const out = []
  for (const g of apiGenerations) {
    const mapped = mapGeneration(g)
    if (mapped) out.push(mapped)
  }
  return out
}
