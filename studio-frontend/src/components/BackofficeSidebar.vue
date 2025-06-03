<template>
  <nav class="backoffice-sidebar">
    <router-link
      :to="{ name: 'backoffice' }"
      exact
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="house" size="sm"></ph-icon>
      <span class="tab__label">{{ $t("backoffice.navigation.home") }}</span>
    </router-link>
    <router-link
      v-if="isSuperAdministrator"
      :to="{ name: 'backoffice-userList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="users" size="sm"></ph-icon>
      <span class="tab__label">{{ $t("backoffice.navigation.users") }}</span>
    </router-link>
    <router-link
      v-if="isAtLeastSystemAdministrator"
      :to="{ name: 'backoffice-organizationList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="buildings" size="sm"></ph-icon>
      <span class="tab__label">{{
        $t("backoffice.navigation.organisations")
      }}</span>
    </router-link>
    <router-link
      v-if="isAtLeastSystemAdministrator"
      :to="{ name: 'backoffice-transcriberProfilesList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="waves" size="sm"></ph-icon>
      <span class="tab__label">{{
        $t("backoffice.navigation.transcriberProfiles")
      }}</span>
    </router-link>
  </nav>
</template>
<script>
import { platformRoleMixin } from "@/mixins/platformRole.js"
export default {
  mixins: [platformRoleMixin],
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>

<style lang="scss">
.backoffice-sidebar {
  a {
    padding: 0.5em 1em;
  }

  a.router-link-exact-active {
    background: var(--primary-soft);
  }
}
</style>
