import type { CoreCapabilities, SummaryCapabilities } from "./types"

/** What the reports offered before capabilities covered them: generate and
 *  edit, but no generation of a report that is already up to date. */
export const DEFAULT_SUMMARY_CAPABILITIES: Readonly<SummaryCapabilities> =
  Object.freeze({ generate: true, edit: true, forceGenerate: false })

/** The report permissions, defaults filled in for a host that sets none. */
export function computeSummaryCapabilities(
  capabilities: CoreCapabilities,
): Readonly<SummaryCapabilities> {
  return capabilities.summary ?? DEFAULT_SUMMARY_CAPABILITIES
}

/** Whether the reader may chat. A host that sets nothing keeps the chat. */
export function computeCanChat(capabilities: CoreCapabilities): boolean {
  return capabilities.chat !== "disabled"
}
