import { getLLMService } from "@/api/service.js"
import { filterLLMServicesBySecurityLevel } from "@/tools/filterBySecurityLevel.js"
import { buildReportCatalogEntry } from "@/tools/llm/buildReportCatalogEntry.js"

// The services offered to the organization at the conversation's security
// level. Registered in the editor as loading: their state is the one of the
// followed track, known once its job list is (see TrackSummary).
export async function loadCatalog(summaryController) {
  const { organizationId, securityLevel, locale } = summaryController
  // An empty list when the request failed: no report to offer.
  const services = await getLLMService(organizationId, securityLevel)
  if (summaryController.destroyed) return
  for (const service of filterLLMServicesBySecurityLevel(
    services,
    securityLevel,
  )) {
    const entry = buildReportCatalogEntry(service, locale)
    summaryController.catalog.set(entry.id, entry)
    summaryController.core.llmServices.register({
      id: entry.id,
      label: entry.label,
      status: "loading",
    })
  }
}
