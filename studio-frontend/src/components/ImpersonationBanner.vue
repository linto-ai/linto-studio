<template>
  <div class="impersonation-banner flex gap-small align-center">
    <ph-icon name="eye" />
    <div class="flex1 impersonation-banner__title">
      {{
        $t("impersonation.banner", {
          name: organizationName,
        })
      }}
    </div>
    <Button
      @click="exitImpersonation"
      :label="$t('impersonation.exit_button_label')"
      icon="sign-out"
      size="sm"
      variant="secondary" />
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { orgDisplayName } from "@/tools/orgDisplayName.js"

export default {
  computed: {
    ...mapGetters("system", ["impersonatedOrganizationId"]),
    ...mapGetters("user", { userId: "getUserId" }),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
    }),
    organizationName() {
      return orgDisplayName(this.currentOrganization, this.userId)
    },
  },
  methods: {
    exitImpersonation() {
      // navigating to a backoffice route clears the impersonation state
      this.$router.push({
        name: "backoffice-organizationDetail",
        params: { organizationId: this.impersonatedOrganizationId },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.impersonation-banner {
  background-color: var(--warning-soft);
  border: 1px solid var(--neutral-20);
  padding: 0.5rem;
  border-radius: 4px;
}

.impersonation-banner__title {
  font-weight: bold;
}
</style>
