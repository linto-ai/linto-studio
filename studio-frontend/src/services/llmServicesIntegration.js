import { createLLMServicesPlugin } from "@linto/transcript-ui/webcomponent"
import {
  getLLMService,
  apiGetMetadataLLMService,
  apiGetExportContent,
} from "@/api/service.js"
import {
  apiGetGenericFileFromConversation,
  apiGetJsonFileFromConversation,
  apiGetTextFileFromConversation,
} from "@/api/conversation.js"
import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"
import { filterLLMServicesBySecurityLevel } from "@/tools/filterBySecurityLevel.js"
import { formatTimestamp } from "@/tools/formatDate.js"

/**
 * Wires the LLM services plugin into the host app.
 *
 * @param {object} core SDK core instance (with llmServices register-able)
 * @param {object} ctx
 * @param {string} ctx.conversationId
 * @param {string} ctx.organizationId
 * @param {string} ctx.securityLevel
 * @param {string} ctx.conversationName
 * @param {object} ctx.apiEventWS  Singleton WS wrapper (Vue.prototype.$apiEventWS)
 * @param {string} ctx.locale
 * @param {(key: string, params?: object) => string} ctx.t
 * @param {(type: string, message: string) => void} ctx.notify
 * @returns {{ dispose(): void }}
 */
export function setupLLMServices(core, ctx) {
  const serviceMap = Object.create(null)
  let socket = null
  let socketJoined = false
  let destroyed = false
  const unsubCoreEvents = []

  function mapStatus(s) {
    return s === "started" ? "processing" : s
  }

  function findIdByJobId(jobId) {
    for (const [id, entry] of Object.entries(serviceMap)) {
      if (entry.jobId === jobId) return id
    }
    return null
  }

  function findIdByFormat(format) {
    if (!format) return null
    for (const [id, entry] of Object.entries(serviceMap)) {
      if (entry.format === format || id === format) return id
    }
    return null
  }

  function resolveId(update) {
    const byJob = findIdByJobId(update.jobId)
    if (byJob) return byJob
    const fmt = update.serviceFormat || update.serviceName || update.format
    const byFmt = findIdByFormat(fmt)
    if (byFmt) {
      // sync the new jobId for future lookups
      serviceMap[byFmt].jobId = update.jobId
    }
    return byFmt
  }

  function exportFilename(ext) {
    const base = (ctx.conversationName || "export").replace(/\s/g, "_")
    return `${base}_${formatTimestamp()}${ext.startsWith(".") ? ext : "." + ext}`
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  function downloadText(content, mime, filename) {
    downloadBlob(new Blob([content], { type: mime }), filename)
  }

  // ── Loading ──────────────────────────────────────────────────────────

  async function loadServices() {
    let services = []
    try {
      services = await getLLMService(ctx.organizationId, ctx.securityLevel)
    } catch (e) {
      console.error("[llm] getLLMService failed", e)
      return
    }
    if (destroyed) return

    services = filterLLMServicesBySecurityLevel(services, ctx.securityLevel)

    let jobs = []
    try {
      jobs = (await apiGetMetadataLLMService(ctx.conversationId)) || []
    } catch (e) {
      console.error("[llm] apiGetMetadataLLMService failed", e)
    }
    if (destroyed) return

    const hydrationTargets = []

    for (const service of services) {
      const id = service.route || service.name
      const label = getDescriptionByLanguage(
        service.description,
        ctx.locale,
        service.name,
      )
      const defaultFlavor =
        service.flavors?.find((f) => f.is_default) || service.flavors?.[0]
      const job = jobs.find((j) => j.format === id)

      serviceMap[id] = {
        format: service.format || id,
        route: service.route || id,
        flavor: defaultFlavor?.name ?? null,
        jobId: job?.jobId ?? null,
        lastUpdate: job?.last_update ?? null,
      }

      core.llmServices.register({
        id,
        label,
        status: mapStatus(job?.status) ?? "idle",
        lastUpdate: job?.last_update ?? null,
      })

      const status = mapStatus(job?.status)
      if (status === "processing" || status === "queued") {
        core.llmServices.setProgress(
          id,
          Number(job?.processing) || 0,
          job?.phase ?? null,
        )
      }

      if (job?.jobId && status === "complete") {
        hydrationTargets.push({ id, jobId: job.jobId, lastUpdate: job.last_update })
      }
    }

    // Hydrate already-completed services in parallel
    await Promise.allSettled(
      hydrationTargets.map(async ({ id, jobId, lastUpdate }) => {
        try {
          const r = await apiGetExportContent(ctx.conversationId, jobId)
          if (destroyed) return
          if (r?.status === "success" && typeof r.content === "string") {
            core.llmServices.setContent(id, r.content, lastUpdate || Date.now())
          }
        } catch (e) {
          console.error("[llm] hydrate failed for", id, e)
        }
      }),
    )
  }

  // ── WebSocket ────────────────────────────────────────────────────────

  function attachSocket() {
    if (!ctx.apiEventWS?.socket) return
    socket = ctx.apiEventWS.socket
    socket.on("llm:job:update", onLlmJobUpdate)
    socket.on("llm:job:complete", onLlmJobComplete)
    socket.on("llm:job:error", onLlmJobError)
    socket.emit("llm:join", {
      organizationId: ctx.organizationId,
      conversationId: ctx.conversationId,
    })
    socketJoined = true
  }

  function detachSocket() {
    if (!socket) return
    if (socketJoined) {
      try {
        socket.emit("llm:leave", {
          organizationId: ctx.organizationId,
          conversationId: ctx.conversationId,
        })
      } catch (e) {
        // ignore — socket may already be closed
      }
      socketJoined = false
    }
    socket.off("llm:job:update", onLlmJobUpdate)
    socket.off("llm:job:complete", onLlmJobComplete)
    socket.off("llm:job:error", onLlmJobError)
    socket = null
  }

  function onLlmJobUpdate(update) {
    if (
      update.conversationId &&
      update.conversationId !== ctx.conversationId
    ) {
      return
    }
    const id = resolveId(update)
    if (!id) return

    const status = mapStatus(update.status)
    if (status) core.llmServices.setStatus(id, status)
    core.llmServices.setProgress(
      id,
      Number(update.progress?.percentage) || 0,
      update.progress?.phase ?? null,
    )
  }

  async function onLlmJobComplete(update) {
    if (
      update.conversationId &&
      update.conversationId !== ctx.conversationId
    ) {
      return
    }
    const id = resolveId(update)
    if (!id) return

    core.llmServices.setStatus(id, "complete")

    try {
      const r = await apiGetExportContent(ctx.conversationId, update.jobId)
      if (destroyed) return
      if (r?.status === "success" && typeof r.content === "string") {
        core.llmServices.setContent(id, r.content, Date.now())
      } else {
        core.llmServices.setError(id, ctx.t("publish.llm_gateway_unavailable"))
      }
    } catch (e) {
      if (destroyed) return
      core.llmServices.setError(id, ctx.t("publish.llm_gateway_unavailable"))
    }
  }

  function onLlmJobError(update) {
    if (
      update.conversationId &&
      update.conversationId !== ctx.conversationId
    ) {
      return
    }
    const id = resolveId(update)
    if (!id) return
    core.llmServices.setError(
      id,
      update.error || ctx.t("publish.error_llm_server"),
    )
  }

  // ── Core events (user actions) ───────────────────────────────────────

  async function onLLMRegenerate({ id }) {
    const entry = serviceMap[id]
    if (!entry) return

    core.llmServices.setStatus(id, "queued")
    core.llmServices.setProgress(id, 0, null)
    core.llmServices.setError(id, null)

    try {
      const req = await apiGetGenericFileFromConversation(
        ctx.conversationId,
        entry.route,
        entry.flavor,
        {
          preview: false,
          title: id,
          regenerate: true,
          llmOutputType: "markdown",
        },
      )
      if (destroyed) return
      if (req?.status === "error") {
        core.llmServices.setError(
          id,
          req?.message || ctx.t("publish.generic_error"),
        )
      }
      // On success, the WS will drive subsequent setProgress / setStatus / setContent.
    } catch (e) {
      if (destroyed) return
      core.llmServices.setError(id, ctx.t("publish.generic_error"))
    }
  }

  function onLLMExport({ id }) {
    const entry = serviceMap[id]
    if (!entry?.jobId) {
      ctx.notify("error", ctx.t("publish.export_error"))
      return
    }
    if (typeof ctx.openPublication !== "function") {
      console.warn(
        "[llm] openPublication callback missing — host did not wire the modal",
      )
      return
    }
    ctx.openPublication({ serviceId: id, jobId: entry.jobId })
  }

  async function onVerbatimExport({ format }) {
    try {
      switch (format) {
        case "docx":
        case "pdf": {
          const req = await apiGetGenericFileFromConversation(
            ctx.conversationId,
            "verbatim",
            null,
            { preview: format === "pdf", title: ctx.conversationName },
          )
          if (req?.status === "success") {
            downloadBlob(req.data, exportFilename(format))
          } else {
            throw new Error("verbatim export failed")
          }
          break
        }
        case "txt": {
          const req = await apiGetTextFileFromConversation(
            ctx.conversationId,
            [],
            [],
          )
          if (req?.status === "success") {
            downloadText(req.data, "text/plain", exportFilename("txt"))
          } else {
            throw new Error("verbatim txt export failed")
          }
          break
        }
        case "json": {
          const req = await apiGetJsonFileFromConversation(
            ctx.conversationId,
            [],
            [],
          )
          if (req?.status === "success") {
            downloadText(
              JSON.stringify(req.data, null, 4),
              "application/json",
              exportFilename("json"),
            )
          } else {
            throw new Error("verbatim json export failed")
          }
          break
        }
        case "whisperx": {
          const req = await apiGetJsonFileFromConversation(
            ctx.conversationId,
            [],
            [],
            "whisperx",
          )
          if (req?.status === "success") {
            downloadText(
              JSON.stringify(req.data, null, 2),
              "application/json",
              exportFilename("_whisperx.json"),
            )
          } else {
            throw new Error("verbatim whisperx export failed")
          }
          break
        }
        default:
          break
      }
    } catch (e) {
      console.error("[llm] verbatim export failed", e)
      ctx.notify("error", ctx.t("publish.export_error"))
    }
  }

  // ── Init ─────────────────────────────────────────────────────────────

  core.use(createLLMServicesPlugin())

  unsubCoreEvents.push(
    core.on("llmService:regenerate", onLLMRegenerate),
    core.on("llmService:export", onLLMExport),
    core.on("verbatim:export", onVerbatimExport),
  )

  loadServices()
  attachSocket()

  return {
    dispose() {
      destroyed = true
      detachSocket()
      unsubCoreEvents.forEach((fn) => fn?.())
      unsubCoreEvents.length = 0
    },
  }
}
