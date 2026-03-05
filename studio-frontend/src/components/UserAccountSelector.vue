<template>
  <div class="user-account-selector flex gap-small flex1 align-center">
    <div class="avatar-container">
      <Avatar :src="userAvatar" :text="userInitials" size="lg" @click="openSettingsModal" />
      <Tooltip
        v-if="!userInfo.emailIsVerified"
        :text="$t('app_settings_modal.email_not_verified')"
        icon="warning"
        :position="isMobile ? 'left' : 'bottom'"
        backgroundColor="var(--red-chart)"
        borderColor="var(--red-chart)"
        color="white"
        :maxWidth="isMobile ? 250 : 300"
        class="email-notification-tooltip">
        <div class="notification-badge"></div>
      </Tooltip>
    </div>
    <div class="flex-1 metadata">
      <div class="user-name">{{ UserName }}</div>
      <Button
        v-if="backoffice"
        @click="openOrganizationSelector"
        :label="$t('modal_switch_org.title')"
        size="xs"
        variant="link"
        color="neutral"
        icon="swap"
        class="organization-switch" />
    </div>
    <Button
      icon="gear"
      variant="transparent"
      color="neutral"
      @click="openSettingsModal"></Button>
    <Button
      icon="caret-double-left"
      iconWeight="regular"
      variant="transparent"
      @click="toggleSidebar"></Button>
    <ModalSwitchOrg
      v-if="backoffice"
      v-model="modalOrganizationSelector"
      @close="modalOrganizationSelector = false" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"
import Tooltip from "@/components/atoms/Tooltip.vue"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"

export default {
  components: { Tooltip, ModalSwitchOrg },
  mixins: [platformRoleMixin],
  props: {
    backoffice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalOrganizationSelector: false,
    }
  },
  computed: {
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
    ...mapGetters("system", ["isMobile"]),
    UserName() {
      return userName(this.userInfo)
    },
    userInitials() {
      // Generate initials from user name (e.g., "John Doe" -> "JD")
      if (!this.UserName) return ""
      const parts = this.UserName.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      }
      return this.UserName.substring(0, 2).toUpperCase()
    },
    userAvatar() {
      return userAvatar(this.userInfo)
    },
  },
  methods: {
    openOrganizationSelector() {
      this.modalOrganizationSelector = true
    },
    openSettingsModal() {
      this.$store.dispatch("settings/setModalOpen", true)
    },
    toggleSidebar() {
      this.$store.dispatch("system/toggleSidebar")
    },
  },
}
</script>

<style lang="scss">
.user-account-selector {
  .avatar-container {
    position: relative;
    display: inline-block;
    z-index: 100;
  }

  .notification-badge {
    width: 12px;
    height: 12px;
    background-color: var(--red-chart);
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
  }

  .email-notification-tooltip {
    position: absolute;
    top: -4px;
    right: -4px;
    z-index: 100;
  }

  .metadata {
    line-height: normal;
    font-size: 0.9em;
  }

  .user-name {
    font-weight: bold;
  }

  .organization-switch {
    align-self: flex-start;
  }
}
</style>
