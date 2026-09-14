<template>
  <nav class="burger-menu">
    <MenuBrandHeader v-if="isAuthenticated" />
    <div class="burger-menu__header flex" v-if="isAuthenticated && !backoffice">
      <MenuOrgSwitcher />
    </div>

    <div class="burger-menu__body">
      <MediaExplorerMenu
        v-if="!backoffice && isAuthenticated"
        :organizationId="currentOrganization._id" />

      <BackofficeSidebar v-if="backoffice" />

      <div class="flex1 flex col overflow-vertical-auto" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
    <div class="burger-menu__footer-section">
      <ButtonRoller
        v-if="
          !backoffice &&
          isAtLeastUploader &&
          canStartConversationInCurrentOrganization &&
          $route.name !== 'conversations create'
        "
        @click="startConversation"
        :label="$t('navigation.conversation.start')"
        variant="primary"
        class="start-button" />

      <IsCloud v-if="isAuthenticated && !backoffice">
        <SaasUsageFooter />
      </IsCloud>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from "vuex"

import { getEnv } from "@/tools/getEnv"
import MenuBrandHeader from "@/components/MenuBrandHeader.vue"
import MenuOrgSwitcher from "@/components/MenuOrgSwitcher.vue"
import IsCloud from "@/components/atoms/IsCloud.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"
import { userName } from "@/tools/userName.js"
import { logout } from "@/tools/logout"

import MediaExplorerMenu from "@/components/MediaExplorerMenu.vue"
import BackofficeSidebar from "@/components/BackofficeSidebar.vue"
import MediaExplorerMenuLabels from "@/components/MediaExplorerMenuLabels.vue"
import SaasUsageFooter from "@/components-cloud/SaasUsageFooter.vue"

export default {
  mixins: [orgaRoleMixin, organizationPermissionsMixin],
  props: {
    backoffice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    logout() {
      logout()
    },
    handleOpenOrganization() {
      this.$router.push({
        name: "organization",
        params: { organizationId: this.currentOrganizationScope },
      })
    },
    startConversation() {
      this.$router.push({
        name: "conversations create",
        params: { organizationId: this.currentOrganizationScope },
      })
    },
  },
  computed: {
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("user", {
      userInfo: "getUserInfos",
      isAuthenticated: "isAuthenticated",
    }),
    organizationsList() {
      return Object.values(this.organizations)
    },
    sessionEnable() {
      return getEnv("VUE_APP_ENABLE_SESSION") === "true"
    },
    userName() {
      return userName(this.userInfo)
    },
    isInbox() {
      const inboxPages = [
        "inbox",
        "explore",
        "explore-favorites",
        "explore-shared",
      ]

      return inboxPages.includes(this.$route.name)
    },
    imgUrl() {},
    mainListingPage() {
      return this.$route.meta?.mainListingPage
    },
    sessionListingPage() {
      return this.$route.meta?.sessionListingPage
    },
  },
  components: {
    MenuBrandHeader,
    MenuOrgSwitcher,
    MediaExplorerMenu,
    BackofficeSidebar,
    MediaExplorerMenuLabels,
    IsCloud,
    SaasUsageFooter,
  },
}
</script>

<style lang="scss">
.burger-menu {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .burger-menu__body {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  // .burger-menu__header {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   padding: 0 0.5em;
  //   background-color: white;
  //   height: 64px;
  //   box-shadow: var(--shadow-block);
  //   border-bottom: var(--border-block);
  //   overflow: visible;
  //   position: relative;
  //   z-index: 10;
  //   flex-shrink: 0;

  //   & > * {
  //     flex: 1;
  //   }
  // }

  .user-account-selector-container {
    padding: 0 0.5em;
    display: flex;
    align-items: center;
    border-bottom: var(--border-block);
    height: 54px;

    & > * {
      flex: 1;
    }
  }

  .org-cloud {
    padding: 1em;
    background-color: #f5f5f5;
    border-top: 1px solid var(--primary-soft);
    border-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    font-size: 0.8em;
    font-weight: 600;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__body {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
      padding: 1em;
      background-color: #fff;
      border-radius: 4px;
      margin-top: 1em;
    }
  }

  .burger-menu__footer-section {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .start-button {
    align-self: stretch;
    margin: 1rem;
  }
}
</style>
