import {
  filterByMetaSecurityLevel,
  filterBySecurityLevel,
} from "../rights/filterBySecurityLevel.js"

/**
 * The "when to transcribe" choices at a security level: going live takes a
 * profile, the version made at the end a service.
 * @param {number} securityLevel
 * @param {{ profiles: object[], services: object[] }} catalog
 * @returns {{ name: string, disabled: boolean }[]}
 */
export function computeTimingOptions(securityLevel, catalog) {
  const hasProfile =
    filterByMetaSecurityLevel(catalog.profiles, securityLevel).length > 0
  const hasService =
    filterBySecurityLevel(catalog.services, securityLevel).length > 0
  return [
    { name: "live", disabled: !hasProfile },
    { name: "offline", disabled: !hasService },
    { name: "both", disabled: !hasProfile || !hasService },
  ]
}
