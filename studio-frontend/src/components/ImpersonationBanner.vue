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

export default {
  computed: {
    ...mapGetters("system", ["impersonatedOrganizationId"]),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
    }),
    organizationName() {
      return this.currentOrganization?.name || ""
    },
  },
  methods: {
    async exitImpersonation() {
      const organizationId = this.impersonatedOrganizationId
      await this.$store.dispatch("system/stopImpersonation")
      this.$router.push({
        name: "backoffice-organizationDetail",
        params: { organizationId },
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
