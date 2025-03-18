<template>
  <nav class="burger-menu mobile">
    <div class="flex align-center burger-menu__header">
      <button class="transparent only-icon">
        <span class="icon back"></span>
      </button>
      <router-link
        :title="$t('navigation.home')"
        to="/interface"
        class="flex align-center gap-small">
        <img :src="logo" style="height: 3rem" />
        <h1>
          {{ title }}
        </h1>
      </router-link>
    </div>
    <OrganizationSelector
      fullwidth
      :currentOrganizationScope="currentOrganizationScope"
      :currentOrganization="currentOrganization" />

    <div class="tabs col flex1">
      <!-- <router-link
        :to="{ name: 'inbox' }"
        class="flex row align-center gap-medium tab">
        <span class="icon home"></span>
        <span class="tab__label">{{ $t("navigation.tabs.inbox") }}</span>
      </router-link> -->
      <router-link
        :to="{ name: 'explore' }"
        class="flex row align-center gap-medium tab">
        <span class="icon discover"></span>
        <span class="tab__label">{{ $t("navigation.tabs.explore") }}</span>
      </router-link>
      <router-link
        v-if="sessionEnable"
        :to="{ name: 'sessionsList' }"
        class="flex row align-center gap-medium tab">
        <span class="icon session"></span>
        <span class="tab__label">{{ $t("navigation.tabs.sessions") }}</span>
      </router-link>
    </div>

    <div class="burger-menu__footer">
      <div class="flex align-center gap-medium burger-menu__footer__title">
        <img :src="imgUrl" class="avatar" /> {{ userName }}
      </div>

      <div class="tabs col">
        <router-link
          :to="{ name: 'shared with me' }"
          class="flex row align-center gap-medium tab">
          <span class="icon share"></span>
          <span class="tab__label">{{ $t("navigation.tabs.shared") }}</span>
        </router-link>
        <router-link
          :to="{ name: 'favorites' }"
          class="flex row align-center gap-medium tab">
          <span class="icon star"></span>
          <span class="tab__label">{{ $t("navigation.tabs.favorites") }}</span>
        </router-link>
        <div class="sidebar-divider"></div>
        <router-link
          :to="{ name: 'shared with me' }"
          class="flex row align-center gap-medium tab">
          <span class="icon settings"></span>
          <span class="tab__label">{{
            $t("navigation.account.account_link")
          }}</span>
        </router-link>

        <button class="flex row align-center gap-medium tab transparent">
          <span class="icon logout"></span>
          <span class="tab__label">{{ $t("navigation.account.logout") }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
<script>
import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import OrganizationSelector from "@/components/OrganizationSelector.vue"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { organizationPermissionsMixin } from "@/mixins/organizationPermissions.js"
import { userName } from "@/tools/userName.js"

export default {
  mixins: [orgaRoleMixin, organizationPermissionsMixin],
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    logo() {
      return `/img/${getEnv("VUE_APP_LOGO")}`
    },
    title() {
      return getEnv("VUE_APP_NAME")
    },
    currentOrganization() {
      return this.$store.state.currentOrganization
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    currentOrganizationScope() {
      return this.currentOrganization._id
    },
    sessionEnable() {
      return getEnv("VUE_APP_ENABLE_SESSION") === "true"
    },
    userName() {
      return userName(this.userInfo)
    },
    imgUrl() {
      const imageUrl = this.userInfo.img ?? "pictures/default.jpg"
      return `${process.env.VUE_APP_PUBLIC_MEDIA}/${imageUrl}`
    },
  },
  components: {
    OrganizationSelector,
  },
}
</script>
