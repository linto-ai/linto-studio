<template>
  <CustomSelect
    :valueText="UserName"
    :value="UserName"
    :icon="imgUrl"
    :iconText="$t('navigation.account.avatar_title')"
    :aria-label="$t('navigation.account.title')"
    iconType="img"
    id="user-menu"
    menuPosition="left"
    :badge="badgeValue"
    @input="clickMenu"
    :options="{
      medias: [
        {
          value: 'shared',
          text: $t('navigation.tabs.shared'),
          icon: 'share',
          iconText: 'share',
        },
        {
          value: 'favorites',
          text: $t('navigation.tabs.favorites'),
          icon: 'star',
          iconText: 'Favorites',
        },
      ],
      user: [
        {
          value: 'account',
          text: $t('navigation.account.account_link'),
          icon: 'account',
          iconText: 'Account',
          badge: badgeValue,
        },
        {
          value: 'logout',
          text: $t('navigation.account.logout'),
          icon: 'logout',
          iconText: 'Logout',
        },
      ],
    }" />
  <!--
    <div
      class="user-menu-notification"
      v-if="
        accountNotifications.updatePassword ||
        accountNotifications.inviteAccount ||
        !userInfo.emailIsVerified
      ">
      1
    </div>
  </div>
  -->
</template>
<script>
import { bus } from "../main.js"
import { userName } from "@/tools/userName.js"
import CustomSelect from "./CustomSelect.vue"

export default {
  props: {
    userInfo: { type: Object, required: true },
  },
  data() {
    return {
      userMenuOpened: false,
      userId: "",
    }
  },
  mounted() {
    bus.$on("navigation", this.closeMenu)
  },
  beforeCreate() {
    bus.$off("navigation", this.closeMenu)
  },
  computed: {
    user() {
      return this.$store.state.userInfo
    },
    imgUrl() {
      return `${process.env.VUE_APP_PUBLIC_MEDIA}/${this.userInfo.img}`
    },
    currentRoute() {
      return this.$route
    },
    accountNotifications() {
      return (
        this.userInfo.accountNotifications ?? {
          updatePassword: false,
          inviteAccount: false,
        }
      )
    },
    UserName() {
      return userName(this.user)
    },
    badgeValue() {
      if (
        this.accountNotifications.updatePassword ||
        this.accountNotifications.inviteAccount ||
        !this.userInfo.emailIsVerified
      ) {
        return 1
      } else {
        return null
      }
    },
  },
  methods: {
    closeMenu() {
      this.userMenuOpened = false
    },
    clickMenu(value) {
      if (value === "account") {
        this.$router.push(`/interface/user/settings`)
      }
      if (value === "favorites") {
        this.$router.push({ name: "favorites" })
      }
      if (value === "shared") {
        this.$router.push({ name: "shared with me" })
      }
      if (value === "logout") {
        this.logout()
      }
    },
    capitalizeFirstLetter(string) {
      return this.$options.filters.CapitalizeFirstLetter(string)
    },
    async logout() {
      this.$options.filters.logout()
    },
  },
  components: {
    CustomSelect,
  },
}
</script>
