<template>
  <div class="user-account-selector flex gap-small flex1 align-center">
    <div class="avatar-container">
      <Avatar :src="userAvatar" size="lg" @click="openSettingsModal" />
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
      <div class="user-role">{{ currentRoleToString }}</div>
      <Button
        @click="openOrganizationSelector"
        :label="orgaName"
        size="xs"
        variant="link"
        color="neutral"
        icon="swap"
        class="organization-name" />
    </div>
    <Button
      icon="gear"
      variant="transparent"
      color="neutral"
      @click="openSettingsModal"></Button>
    <ModalSwitchOrg
      v-model="modalOrganizationSelector"
      @close="modalOrganizationSelector = false" />
    <!-- <Button
      icon="sidebar-simple"
      variant="transparent"
      @click="toggleSidebar"></Button> -->
    <!-- <Button
      icon="arrow-line-left"
      variant="transparent"
      @click="toggleSidebar"></Button> -->
    <Button
      icon="caret-double-left"
      iconWeight="regular"
      variant="transparent"
      @click="toggleSidebar"></Button>
  </div>
  <!-- <PopoverList
    :items="navList.userMenu"
    @click="handleClick"
    class="user-account-selector"
    :close-on-click="true"
    width="ref">
    <template #trigger="{ open }">
      <Button
        :avatar="userAvatar"
        :avatar-text="uname"
        :avatar-color="getColorFromText(UserName)"
        :icon-right="open ? 'caret-up' : 'caret-down'"
        variant="outline"
        block>
        {{ UserName }}
      </Button>
    </template>
  </PopoverList> -->
</template>

<script>
import { mapGetters } from "vuex"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"
import Tooltip from "@/components/atoms/Tooltip.vue"

export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {
    backoffice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: false,
      modalOrganizationSelector: false,
    }
  },
  mounted() {},
  beforeDestroy() {},
  computed: {
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("system", ["isMobile"]),
    UserName() {
      return userName(this.userInfo)
    },
    uname() {
      return this.UserName.length > 2
        ? this.UserName.slice(0, 2)
        : this.UserName
    },
    userAvatar() {
      return userAvatar(this.userInfo)
    },
    orgaName() {
      return this.backoffice ? "Backoffice" : this.currentOrganization?.name
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
  components: {
    ModalSwitchOrg,
    Tooltip,
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

  .organization-name {
    align-self: flex-start;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration-color: var(--primary-color);
  }

  .organization-name .btn-prefix-label,
  .organization-name .label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .organization-name .label {
    display: inline;
    font-size: 14px;
    color: var(--primary-color);
  }

  .user-role {
    color: var(--text-secondary);
    white-space: nowrap;
    font-weight: 400;
    text-transform: lowercase;
    font-size: 0.9em;

    @media (max-width: 1100px) {
      font-size: 0.9em;
    }
  }
}
</style>
