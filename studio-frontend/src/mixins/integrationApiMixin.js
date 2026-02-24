import { createIntegrationApi } from "@/api/integrationApiFactory"

export default {
  props: {
    scope: {
      type: String,
      default: "organization",
    },
  },
  computed: {
    isPlatform() {
      return this.scope === "platform"
    },
    api() {
      return createIntegrationApi(this.scope, this.organizationId)
    },
  },
}
