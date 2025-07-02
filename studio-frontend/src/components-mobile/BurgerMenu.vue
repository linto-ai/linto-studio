<template>
  <nav class="burger-menu">
    <div>
      <div class="burger-menu__header flex">
        <UserAccountSelector :backoffice="backoffice" />
      </div>
      <!-- <div class="user-account-selector-container" v-if="!backoffice">
        <ActionConversationCreate />
      </div> -->

      <MediaExplorerMenu
        :organizationId="currentOrganization._id"
        v-if="!backoffice" />

      <MediaExplorerMenuLabels v-if="isInbox" />

      <BackofficeSidebar v-if="backoffice" />

      <slot></slot>
    </div>
    <div>
      <cloud-card-credits />
    </div>
  </nav>
</template>
<script>
import { mapGetters } from "vuex"

import { getEnv } from "@/tools/getEnv"
import UserAccountSelector from "@/components/UserAccountSelector.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"
import { userName } from "@/tools/userName.js"
import { logout } from "@/tools/logout"

import LocalSwitcher from "@/components/LocalSwitcher.vue"
import CloudCardCredits from "@/components-cloud/CardCredits.vue"
import MediaExplorerMenu from "@/components/MediaExplorerMenu.vue"
import BackofficeSidebar from "@/components/BackofficeSidebar.vue"
import ActionConversationCreate from "@/components/molecules/ActionConversationCreate.vue"
import MediaExplorerMenuLabels from "@/components/MediaExplorerMenuLabels.vue"

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
  },
  computed: {
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
    ...mapGetters("user", { userInfo: "getUserInfos" }),
    logo() {
      return `/img/${getEnv("VUE_APP_LOGO")}`
    },
    organizationsList() {
      return Object.values(this.organizations)
    },
    title() {
      return getEnv("VUE_APP_NAME")
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
    UserAccountSelector,
    LocalSwitcher,
    CloudCardCredits,
    MediaExplorerMenu,
    BackofficeSidebar,
    ActionConversationCreate,
    MediaExplorerMenuLabels,
  },
}
</script>

<style lang="scss">
.burger-menu {
  display: flex;
  flex-direction: column;
  gap: 1em;

  .burger-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5em;
    background-color: white;
    height: 64px;
    box-shadow: var(--shadow-block);
    border-bottom: var(--border-block);

    & > * {
      flex: 1;
    }
  }

  // fieldset {
  //   border: 1px solid #e0e0e0;
  //   border-radius: 4px;
  //   margin: 0.5em;
  //   padding: 0;
  //   position: relative;

  //   &.active {
  //     border-color: var(--primary-soft);
  //   }

  //   legend {
  //     position: absolute;
  //     font-size: 0.8em;
  //     font-weight: 600;
  //     left: 1em;
  //     top: -10px;
  //     background-color: var(--primary-soft);
  //     padding: 0 0.5em;
  //     border-radius: 1px;
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
}
</style>
