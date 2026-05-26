import {
  getLLMService,
  apiGetMetadataLLMService,
  apiGetExportContent,
} from "@/api/service.js"
import getDescriptionByLanguage from "@/tools/getDescriptionByLanguage.js"
import { filterLLMServicesBySecurityLevel } from "@/tools/filterBySecurityLevel.js"
import { mapStatus } from "@/tools/llm/mapStatus.js"
import { loadVersions } from "../loadVersions.js"
import { loadGenerations } from "../loadGenerations.js"

export async function loadServices({
  core,
  store,
  state,
  conversationId,
  organizationId,
  securityLevel,
  locale,
}) {
  let services = []
  try {
    services = await getLLMService(organizationId, securityLevel)
  } catch (e) {
    console.error("[llm] getLLMService failed", e)
    return
  }
  if (state.destroyed) return

  services = filterLLMServicesBySecurityLevel(services, securityLevel)

  let jobs = []
  try {
    jobs = (await apiGetMetadataLLMService(conversationId)) || []
  } catch (e) {
    console.error("[llm] apiGetMetadataLLMService failed", e)
  }
  if (state.destroyed) return

  const hydrationTargets = []

  for (const service of services) {
    const id = service.route || service.name
    const label = getDescriptionByLanguage(
      service.description,
      locale,
      service.name,
    )
    const defaultFlavor =
      service.flavors?.find((f) => f.is_default) || service.flavors?.[0]
    const job = jobs.find((j) => j.format === id)

    store.commit("llmServices/REGISTER", {
      id,
      data: {
        format: service.format || id,
        route: service.route || id,
        flavor: defaultFlavor?.name ?? null,
        jobId: job?.jobId ?? null,
        lastUpdate: job?.last_update ?? null,
      },
    })

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
      hydrationTargets.push({
        id,
        jobId: job.jobId,
        lastUpdate: job.last_update,
      })
    }
  }

  await Promise.allSettled(
    hydrationTargets.flatMap(({ id, jobId, lastUpdate }) => [
      (async () => {
        try {
          const r = await apiGetExportContent(conversationId, jobId)
          if (state.destroyed) return
          if (r?.status === "success" && typeof r.content === "string") {
            core.llmServices.setContent(id, r.content, lastUpdate || Date.now())
          }
        } catch (e) {
          console.error("[llm] hydrate content failed for", id, e)
        }
      })(),
      loadVersions({ core, store, state, conversationId, id }),
      loadGenerations({ core, store, state, conversationId, id }),
    ]),
  )
}
