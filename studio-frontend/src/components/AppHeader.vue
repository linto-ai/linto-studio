<template>
  <nav id="app-header" class="flex row gap-medium" role="navigation">
    <router-link
      :title="$t('navigation.home')"
      to="/interface"
      class="flex row gap-small header-logo">
      <img src="/img/linto-studio-logo.svg" style="height: 2rem" />
      <h1 id="main-title" style="">Linto Studio</h1>
    </router-link>
    <!-- <router-link
      :title="$t('navigation.conversation.create')"
      to="/interface/conversations/create"
      class="btn nav-link green-border"
      id="main-create-conv-button">
      <span class="icon new"></span>
      <span class="label">{{ $t("navigation.conversation.create") }}</span>
    </router-link> -->
    <div class="flex1 flex align-center justify-center">
      <!--<AppHeaderTabs />
      <Breadcrumb
        :currentRoute="currentRoute"
        :currentOrganization="currentOrganization" />-->
    </div>
    <ThemeSwitcher></ThemeSwitcher>
    <LocalSwitcher></LocalSwitcher>
    <UserSettingsMenu :userInfo="userInfo" />
  </nav>
</template>
<script>
import { bus } from "../main.js"
import Breadcrumb from "@/components/Breadcrumb.vue"
import LocalSwitcher from "@/components/LocalSwitcher.vue"
import UserSettingsMenu from "./UserSettingsMenu.vue"
import OrganizationSelector from "./OrganizationSelector.vue"
import ThemeSwitcher from "./ThemeSwitcher.vue"
export default {
  props: {
    userInfo: { type: Object, required: true },
    currentOrganization: { type: Object, required: true },
    userOrganizations: { type: Array, required: true },
    currentOrganizationScope: { type: String, required: true },
  },
  computed: {
    currentRoute() {
      return this.$route
    },
  },
  components: {
    Breadcrumb,
    LocalSwitcher,
    UserSettingsMenu,
    OrganizationSelector,
    ThemeSwitcher,
  },
}
</script>
