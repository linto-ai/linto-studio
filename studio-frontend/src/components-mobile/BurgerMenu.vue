<template>
  <nav class="burger-menu">
    <div>
      <div class="burger-menu__header flex">
        <UserAccountSelector :backoffice="backoffice" />
      </div>

      <MediaExplorerMenu
        :organizationId="currentOrganization._id"
        v-if="!backoffice" />

      <MediaExplorerMenuLabels v-if="isInbox" />

      <BackofficeSidebar v-if="backoffice" />

      <slot></slot>
    </div>
    <div class="flex col">
      <ButtonRoller
        v-if="isAtLeastUploader"
        @click="startConversation"
        :label="$t('navigation.conversation.start')"
        variant="primary"
        class="start-button" />
      <div class="main-footer-container">
        <footer class="main-footer" v-if="!logo">
          <div class="main-footer__powered-by">
            <i18n path="footer.powered_by">
              <template v-slot:linto_logo>
                <a
                  href="https://linto.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-logo-link">
                  <img src="/img/linto.svg" alt="LinTO" />
                </a>
              </template>
              <template v-slot:linagora_logo>
                <a
                  href="https://linagora.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-logo-link">
                  <img src="/img/linagora.png" alt="Linagora" />
                </a>
              </template>
            </i18n>
          </div>
          <div class="main-footer__links">
            <a href="mailto:contact@linto.ai" class="footer-link">{{
              $t("footer.contact")
            }}</a>
            <span class="footer-version">v{{ appVersion }}</span>
          </div>
        </footer>
        <footer class="footer-logo" v-else>
          <img :src="logo" class="footer-logo__logo" />
          <div class="footer-logo__title">{{ title }}</div>
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
      return getEnv("VUE_APP_LOGO") ? `/img/${getEnv("VUE_APP_LOGO")}` : false
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
    appVersion() {
      return "1.6.0" // Version from package.json
    },
  },
  components: {
    UserAccountSelector,
    LocalSwitcher,
    CloudCardCredits,
    MediaExplorerMenu,
    BackofficeSidebar,
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

    & > * {
      flex: 1;
    }
  }

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

  .start-button {
    align-self: stretch;
    margin: 1rem;
  }

  .main-footer {
    padding: 0.75rem;
    border-top: var(--border-block);
    background-color: var(--primary-soft);

    &__powered-by {
      text-align: center;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
      color: var(--neutral-80);
      line-height: 1.4;

      * {
        display: inline-block;
        vertical-align: middle;
        margin: 0 0.2rem;
      }

      img {
        height: 1.2em;
        transition: transform 0.2s ease;
      }
    }

    &__links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }

  .footer-logo-link {
    display: inline-block;
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;

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
    color: var(--neutral-80);
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    transition: all 0.2s ease;

    &:hover {
      color: var(--primary);
      background-color: rgba(var(--primary-rgb), 0.08);
      text-decoration: none;
    }

    &:focus {
      outline: 2px solid var(--primary);
      outline-offset: 1px;
      color: var(--primary);
    }

    &:active {
      transform: translateY(0.5px);
    }
  }

  .footer-version {
    font-size: 0.7rem;
    font-weight: 400;
    padding: 0.2rem 0.4rem;
    display: inline-block;
    margin-left: 0.25rem;
    color: var(--neutral-90);
    background-color: rgba(var(--neutral-90), 0.05);
    border-radius: 2px;
  }

  .main-footer__logo {
    height: 20px;
  }
}

.footer-logo {
  display: flex;
  flex-direction: column;
  border-top: var(--border-block);
  background-color: var(--primary-soft);
  padding: 0.5rem;
  gap: 0.25rem;

  .footer-logo__logo {
    height: 40px;
  }

  .footer-logo__title {
    text-align: center;
    color: var(--primary-color);
    font-weight: bold;
  }
}
</style>
