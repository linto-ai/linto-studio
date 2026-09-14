<template>
  <div class="m-page">
    <AppHeader
      :organization-name="organizationName"
      :role-label="roleLabel"
      :initials="initials"
      @open-organizations="organizationsOpen = true"
      @open-account="accountOpen = true" />

    <main class="m-page__content m-home">
      <ActionButton
        :to="{ name: 'record' }"
        icon="microphone"
        :title="$t('mobile.home.record_title')"
        :subtitle="$t('mobile.home.record_subtitle')" />
      <ActionButton
        :to="{ name: 'media' }"
        icon="folder"
        :title="$t('mobile.home.media_title')"
        :subtitle="$t('mobile.home.media_subtitle')" />
      <ActionButton
        :to="{ name: 'live' }"
        icon="broadcast"
        :title="$t('mobile.home.live_title')"
        :subtitle="liveSubtitle"
        :disabled="!liveEnabled" />
    </main>

    <OrgPickerSheet
      v-model="organizationsOpen"
      :organizations="organizations"
      :current-id="organizationId"
      @select="selectOrganization" />
    <AccountSheet
      v-model="accountOpen"
      :user-name="userName"
      :email="email"
      :initials="initials"
      :organization-name="organizationName"
      :role-label="roleLabel"
      @open-organizations="openOrganizationsFromAccount" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import AppHeader from "@/mobile/components/AppHeader.vue"
import ActionButton from "@/mobile/components/ActionButton.vue"
import OrgPickerSheet from "@/mobile/components/OrgPickerSheet.vue"
import AccountSheet from "@/mobile/components/AccountSheet.vue"
import { currentUserMixin } from "@/mobile/mixins/currentUser.js"
import { getEnv } from "@/tools/getEnv"

export default {
  name: "MobileHome",
  components: { AppHeader, ActionButton, OrgPickerSheet, AccountSheet },
  mixins: [currentUserMixin],
  data() {
    return { organizationsOpen: false, accountOpen: false }
  },
  computed: {
    ...mapGetters("organizations", {
      organizations: "getOrganizationsWithUserContext",
    }),
    liveEnabled() {
      return getEnv("VUE_APP_ENABLE_SESSION") === "true"
    },
    liveSubtitle() {
      return this.liveEnabled
        ? this.$t("mobile.home.live_subtitle")
        : this.$t("mobile.home.live_unavailable_disabled")
    },
  },
  methods: {
    ...mapActions("organizations", ["setCurrentOrganizationScope"]),
    async selectOrganization(organizationId) {
      this.organizationsOpen = false
      await this.setCurrentOrganizationScope(organizationId)
    },
    openOrganizationsFromAccount() {
      this.accountOpen = false
      this.organizationsOpen = true
    },
  },
}
</script>

<style scoped>
.m-home {
  gap: var(--m-space-3);
  padding-top: var(--m-space-2);
}
</style>
