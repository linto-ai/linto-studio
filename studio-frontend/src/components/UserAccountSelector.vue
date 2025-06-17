<template>
  <PopoverList
    :items="navList.userMenu"
    @click="handleClick"
    class="user-account-selector"
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
  </PopoverList>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { bus } from "@/main.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
import { userName } from "@/tools/userName"
import userAvatar from "@/tools/userAvatar"
import { getColorFromText } from "@/tools/colors"

import UserProfilePicture from "@/components/atoms/UserProfilePicture.vue"
import PopoverList from "@/components/molecules/PopoverList.vue"

export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
  props: {},
  data() {
    return {
      active: false,
    }
  },
  mounted() {
    bus.$on("navigation", this.closeMenu)
  },
  beforeDestroy() {
    bus.$off("navigation", this.closeMenu)
  },
  computed: {
    ...mapGetters("user", {
      userInfo: "getUserInfos",
    }),
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
    name() {
      // if (this.$route.name === "shared with me") {
      //   return this.$t("navigation.tabs.shared")
      // } else if (this.$route.name === "favorites") {
      //   return this.$t("navigation.tabs.favorites")
      // } else if (this.$route.meta.userPage) {
      //   return this.$t("navigation.tabs.user_page")
      // }
      return `${this.currentOrganization?.name} (${this.roleToString})`
    },
    navList() {
      const userMenu = [
        {
          id: "account",
          text: this.$t("navigation.account.account_link"),
          icon: "user",
          badge: this.badgeValue,
        },
        {
          id: "logout",
          text: this.$t("navigation.account.logout"),
          icon: "sign-out",
          iconText: "Logout",
        },
      ]

      if (this.isSessionOperator || this.isSystemAdministrator) {
        userMenu.unshift({
          id: "backoffice",
          text: this.$t("navigation.backoffice.link_title"),
          icon: "gear",
          iconText: "Backoffice",
        })
      }

      if (this.isAtLeastOrganizationInitiator) {
        settingsItems.push({
          id: "create",
          icon: "plus",
          text: this.$t("navigation.organisation.create"),
        })
      }
      return {
        userMenu,
      }
    },
  },
  methods: {
    handleClick(item) {
      if (item.id === "account") {
        this.openSettingsModal()
      } else if (item.id === "logout") {
        this.logout()
      }
    },
    closeMenu() {
      this.navUserAccountVisible = false
    },
    openSettingsModal() {
      this.$store.dispatch("settings/setModalOpen", true)
    },
    logout() {
      this.$store.dispatch("user/logout")
    },
    getColorFromText,
  },
  components: {
    UserProfilePicture,
    PopoverList,
  },
}
</script>

<style lang="scss">
.user-account-selector {
  position: relative;

  .popover-trigger {
    display: block;

    .btn {
      border-radius: 0;
      border: none;
      background-color: transparent;
      width: 100%;
      justify-content: flex-start;
      padding: 0 1em;
      height: 54px;

      & > .btn-prefix {
        flex: 0 0 42px;

      }
        .label {
          margin-left: .5em;
          display: inline-block
        }
    }
  }
}
</style>
