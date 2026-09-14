<template>
  <div class="menu-org-switcher flex row align-center gap-small flex1">
    <button
      type="button"
      class="menu-org-switcher__trigger flex1 flex row align-center gap-small custom"
      :aria-label="$t('modal_switch_org.title')"
      @click="modalOrgSelector = true">
      <Avatar :src="userAvatar" :text="userInitials" size="lg" circle />
      <span class="menu-org-switcher__info flex col flex1">
        <span
          class="menu-org-switcher__org-line flex row align-center gap-small">
          <span class="menu-org-switcher__org-name">{{ orgName }}</span>
          <IsCloud>
            <Chip :value="planLabel" class="menu-org-switcher__plan" />
          </IsCloud>
        </span>
        <span class="menu-org-switcher__role">{{ currentRoleToString }}</span>
      </span>
      <ph-icon name="caret-up-down" size="sm" color="neutral" weight="bold" />
    </button>
    <Button
      icon="gear"
      variant="transparent"
      color="neutral"
      :aria-label="$t('app_settings_modal.title')"
      @click="openSettingsModal"></Button>

    <ModalSwitchOrg
      v-model="modalOrgSelector"
      @close="modalOrgSelector = false" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { getEnv } from "@/tools/getEnv"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { computeUserInitials } from "@/tools/computeUserInitials"
import userAvatar from "@/tools/userAvatar"
import { userName } from "@/tools/userName"
import Avatar from "@/components/atoms/Avatar.vue"
import Chip from "@/components/atoms/Chip.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"
// Button is registered globally by the atoms plugin (components/atoms/index.js).

// Same one-off check as IsCloud.vue/HasEntitlement.vue: avoids a wasted
// /cloud/plans call in self-hosted (basic) builds.
const IS_MODE_CLOUD = getEnv("VUE_APP_MODE") === "cloud"

export default {
  name: "MenuOrgSwitcher",
  components: { Avatar, Chip, IsCloud, ModalSwitchOrg },
  mixins: [orgaRoleMixin],
  data() {
    return {
      modalOrgSelector: false,
    }
  },
  computed: {
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      currentOrgScope: "getCurrentOrganizationScope",
      orgName: "getCurrentOrganizationDisplayName",
    }),
    ...mapGetters("billing", ["planLabel"]),
    userAvatar() {
      return userAvatar(this.userInfo)
    },
    userInitials() {
      return computeUserInitials(userName(this.userInfo))
    },
    isCloudMode() {
      return IS_MODE_CLOUD
    },
  },
  watch: {
    // The plan chip needs the billing catalog + this org's usage; nothing else
    // fetches it now that SaasUsageFooter is gone from the menu footer.
    currentOrgScope() {
      this.loadBilling()
    },
  },
  mounted() {
    this.loadBilling()
  },
  methods: {
    ...mapActions("billing", ["refresh"]),
    loadBilling() {
      if (this.isCloudMode && this.currentOrgScope)
        this.refresh(this.currentOrgScope)
    },
    openSettingsModal() {
      this.$store.dispatch("settings/setModalOpen", true)
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-org-switcher {
  padding: 0.5rem 1rem;
}

.menu-org-switcher__trigger {
  background: none;
  border: none;
  padding: 0;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  min-width: 0;

  &:hover {
    background-color: var(--primary-soft);
  }
}

.menu-org-switcher__info {
  min-width: 0;
  line-height: 1.2;
}

.menu-org-switcher__org-line {
  min-width: 0;
}

.menu-org-switcher__org-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-org-switcher__plan {
  flex-shrink: 0;
}

.menu-org-switcher__role {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>
