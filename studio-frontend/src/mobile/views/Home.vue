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
        v-if="uploadAllowed"
        :to="{ name: 'record' }"
        icon="microphone"
        :title="$t('mobile.home.record_title')"
        :subtitle="$t('mobile.home.record_subtitle')">
        <template v-if="pendingCount > 0" #badge>
          <span class="m-home__badge">{{
            $t("mobile.home.pending_count", { count: pendingCount })
          }}</span>
        </template>
      </ActionButton>
      <ActionButton
        :to="{ name: 'media' }"
        icon="folder"
        :title="$t('mobile.home.media_title')"
        :subtitle="$t('mobile.home.media_subtitle')" />
      <ActionButton
        v-if="liveAllowed"
        :to="{ name: 'live' }"
        icon="broadcast"
        :title="$t('mobile.home.live_title')"
        :subtitle="liveSubtitle"
        :disabled="!liveEnabled" />

      <div class="m-grow"></div>
      <InstallBanner
        v-if="canInstall"
        @install="startInstall"
        @dismiss="dismissInstall" />
    </main>

    <OrgPickerSheet
      v-model="organizationsOpen"
      :organizations="organizations"
      :current-id="organizationId"
      :favorite-id="favoriteOrganizationId"
      @select="selectOrganization"
      @toggle-favorite="toggleFavoriteOrganization" />
    <AccountSheet
      v-model="accountOpen"
      :user-name="userName"
      :email="email"
      :initials="initials"
      :organization-name="organizationName"
      :role-label="roleLabel"
      :can-install="installAvailable"
      @install="startInstall"
      @open-organizations="openOrganizationsFromAccount" />
    <InstallGuideIos v-model="iosGuideOpen" />
    <InstallGuideAndroid v-model="androidGuideOpen" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import AppHeader from "@/mobile/components/AppHeader.vue"
import ActionButton from "@/mobile/components/ActionButton.vue"
import OrgPickerSheet from "@/mobile/components/OrgPickerSheet.vue"
import AccountSheet from "@/mobile/components/AccountSheet.vue"
import InstallBanner from "@/mobile/components/InstallBanner.vue"
import InstallGuideIos from "@/mobile/components/InstallGuideIos.vue"
import InstallGuideAndroid from "@/mobile/components/InstallGuideAndroid.vue"
import { currentUserMixin } from "@/mobile/mixins/currentUser.js"
import { installMixin } from "@/mobile/mixins/install.js"
import { getEnv } from "@/tools/getEnv"
import { listUserOrganizations } from "@/mobile/tools/listUserOrganizations.js"
import { canStartLive } from "@/mobile/tools/canStartLive.js"
import { canUploadMedia } from "@/mobile/tools/canUploadMedia.js"

export default {
  name: "MobileHome",
  components: {
    AppHeader,
    ActionButton,
    OrgPickerSheet,
    AccountSheet,
    InstallBanner,
    InstallGuideIos,
    InstallGuideAndroid,
  },
  mixins: [currentUserMixin, installMixin],
  data() {
    return { organizationsOpen: false, accountOpen: false }
  },
  created() {
    this.$store.dispatch("mobileRecordings/load")
  },
  computed: {
    ...mapGetters("organizations", {
      organizationList: "getOrganizationsAsArray",
    }),
    ...mapGetters("user", {
      favoriteOrganizationId: "getFavoriteOrganizationId",
    }),
    organizations() {
      return listUserOrganizations(
        this.organizationList,
        this.userId,
        this.$t("navigation.sections.my_space"),
      )
    },
    ...mapGetters("mobileRecordings", ["pendingCount"]),
    // Organization and role rights: the action is not offered at all when
    // they are missing.
    uploadAllowed() {
      return canUploadMedia(
        this.currentOrganization?.permissions,
        this.organizationRole,
      )
    },
    liveAllowed() {
      return canStartLive(
        this.currentOrganization?.permissions,
        this.organizationRole,
      )
    },
    // Instance flag: shown disabled, with the reason as subtitle.
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
    ...mapActions("user", ["toggleFavoriteOrganization"]),
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

.m-home__badge {
  padding: 2px var(--m-space-2);
  border-radius: var(--m-radius-round);
  font-size: 11px;
  font-weight: 600;
  background: var(--m-warning-soft);
  color: var(--m-warning-text);
}
</style>
