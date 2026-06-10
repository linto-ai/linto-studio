import { DEFAULT_SECURITY_LEVEL } from "@/const/securityLevels"

/**
 * Exposes the security-level floor enforced by the current organization.
 *
 * Host component must provide a `currentOrganizationScope` (organization id)
 * and a local `securityLevel` (the level selected for the conversation/session).
 * `effectiveSecurityLevel` is the stricter of the organization floor and the
 * selected level, and should be used to filter the listed transcriber profiles
 * and transcription/LLM services.
 */
export const organizationSecurityLevelMixin = {
  computed: {
    organizationSecurityLevel() {
      const organization = this.$store.getters[
        "organizations/getOrganizationById"
      ](this.currentOrganizationScope)
      return organization?.securityLevel ?? DEFAULT_SECURITY_LEVEL
    },
    effectiveSecurityLevel() {
      return Math.max(
        this.organizationSecurityLevel,
        this.securityLevel ?? DEFAULT_SECURITY_LEVEL,
      )
    },
  },
  watch: {
    // Keep the selected level at or above the organization floor (covers the
    // case where the organization loads after the component is created).
    organizationSecurityLevel: {
      immediate: true,
      handler(orgLevel) {
        if ((this.securityLevel ?? DEFAULT_SECURITY_LEVEL) < orgLevel) {
          this.securityLevel = orgLevel
        }
      },
    },
  },
}
