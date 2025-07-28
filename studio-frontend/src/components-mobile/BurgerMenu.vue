<template>
  <nav class="burger-menu">
    <div>
      <div class="burger-menu__header flex">
        <UserAccountSelector :backoffice="backoffice" />
      </div>
      <!-- <div class="user-account-selector-container" v-if="!backoffice">
        <ActionConversationCreate />
      </div> -->

      <MediaExplorerMenu :organizationId="currentOrganization._id" v-if="!backoffice" />

      <MediaExplorerMenuLabels v-if="isInbox" />

      <BackofficeSidebar v-if="backoffice" />

      <slot></slot>
    </div>
    <div class="flex col">
      <ButtonRoller v-if="isAtLeastUploader" @click="startConversation" :label="$t('navigation.conversation.start')"
        color="primary" class="start-button" />
      <cloud-card-credits />
      <div class="main-footer-container">
        <footer class="main-footer">
          <div class="main-footer__powered-by">
            <i18n path="footer.powered_by">
              <template v-slot:linto_logo>
                <a href="https://linto.ai" target="_blank" rel="noopener noreferrer" class="footer-logo-link">
                  <img src="/img/linto.svg" alt="LinTO" />
                </a>
              </template>
              <template v-slot:linagora_logo>
                <a href="https://linagora.com" target="_blank" rel="noopener noreferrer" class="footer-logo-link">
                  <img src="/img/linagora.png" alt="Linagora" />
                </a>
              </template>
            </i18n>
          </div>
          <div class="main-footer__links">
            <a href="mailto:contact@linto.ai" class="footer-link">{{ $t('footer.contact') }}</a>
            <a href="https://linto.ai/legal" target="_blank" rel="noopener noreferrer" class="footer-link">{{
              $t('footer.legal_notice') }}</a>
            <a href="https://linto.ai/privacy" target="_blank" rel="noopener noreferrer" class="footer-link">{{
              $t('footer.privacy_policy') }}</a>
          </div>
        </footer>
      </div>
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
  mounted() { },
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
    imgUrl() { },
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
  overflow: visible;

  .burger-menu__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5em;
    background-color: white;
    height: 64px;
    box-shadow: var(--shadow-block);
    border-bottom: var(--border-block);
    overflow: visible;
    position: relative;
    z-index: 10;

    &>* {
      flex: 1;
    }
  }

  .user-account-selector-container {
    padding: 0 0.5em;
    display: flex;
    align-items: center;
    border-bottom: var(--border-block);
    height: 54px;

    &>* {
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

  .start-button {
    align-self: stretch;
    margin: 1rem;
  }

  .main-footer {
    padding: 1rem;
    background-color: var(--primary-soft);
    border-top: 1px solid var(--neutral-40);
    border-radius: 8px 8px 0 0;

    &__powered-by {
      text-align: center;
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
      color: var(--neutral-70);

      * {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0.25rem;
      }

      img {
        height: 1.5em;
        transition: transform 0.2s ease;
      }
    }

    &__links {
      display: flex;
      justify-content: center;
      gap: .2rem;
      flex-wrap: wrap;
    }
  }

  .footer-logo-link {
    display: inline-block;
    transition: transform 0.2s ease, opacity 0.2s ease;

    &:hover {
      transform: scale(1.1);
      opacity: 0.8;
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
      border-radius: 4px;
    }
  }

  .footer-link {
    color: var(--neutral-70);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      color: var(--primary);
      background-color: rgba(var(--primary-rgb), 0.1);
      text-decoration: none;
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
      color: var(--primary);
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
