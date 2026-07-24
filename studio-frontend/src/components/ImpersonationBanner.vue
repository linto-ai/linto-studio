<template>
  <div class="impersonation-banner flex gap-small align-center">
    <ph-icon :name="isImpersonatingUser ? 'user-switch' : 'eye'" />
    <div class="flex1 impersonation-banner__title">
      {{ bannerText }}
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
import { userName } from "@/tools/userName.js"

export default {
  computed: {
    ...mapGetters("system", ["isImpersonatingUser"]),
    ...mapGetters("user", { userId: "getUserId", userInfos: "getUserInfos" }),
    ...mapGetters("organizations", {
      impersonatedOrganizationId: "impersonatedOrganizationId",
      currentOrganization: "getCurrentOrganization",
    }),
    organizationName() {
      return orgDisplayName(this.currentOrganization, this.userId)
    },
    bannerText() {
      if (this.isImpersonatingUser) {
        return this.$t("impersonation.user_banner", {
          name: userName(this.userInfos),
        })
      }
      return this.$t("impersonation.banner", { name: this.organizationName })
    },
  },
  methods: {
    exitImpersonation() {
      if (this.isImpersonatingUser) {
        this.$store.dispatch("system/stopUserImpersonation")
        return
      }
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
