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
      :to="{ name: 'backoffice-tokenList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="key" size="sm"></ph-icon>
      <span class="tab__label">{{ $t("backoffice.navigation.tokens") }}</span>
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
    <router-link
      v-if="isAtLeastSystemAdministrator"
      :to="{ name: 'backoffice-sessionList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="broadcast" size="sm"></ph-icon>
      <span class="tab__label">{{
        $t("backoffice.navigation.sessions")
      }}</span>
    </router-link>
    <router-link
      v-if="isAtLeastSystemAdministrator"
      :to="{ name: 'backoffice-activityList' }"
      class="flex row align-center gap-medium tab backoffice-sidebar__link">
      <ph-icon name="notebook" size="sm"></ph-icon>
      <span class="tab__label">{{
        $t("backoffice.navigation.activities")
      }}</span>
    </router-link>

    <div class="backoffice-sidebar__separator"></div>

    <a
      class="flex row align-center gap-medium tab backoffice-sidebar__link backoffice-sidebar__org-switch"
      @click="modalOrgSelector = true">
      <ph-icon name="arrow-left" size="sm"></ph-icon>
      <span class="tab__label">{{ $t("backoffice.navigation.back_to_org") }}</span>
    </a>

    <ModalSwitchOrg v-model="modalOrgSelector" @close="modalOrgSelector = false" />
  </nav>
</template>
<script>
import { platformRoleMixin } from "@/mixins/platformRole.js"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"

export default {
  components: { ModalSwitchOrg },
  mixins: [platformRoleMixin],
  data() {
    return {
      modalOrgSelector: false,
    }
  },
}
</script>

<style lang="scss">
.backoffice-sidebar {
  a {
    padding: 0.5em 1em;
    border-left: 2px solid transparent;
  }

  a.router-link-exact-active {
    background: var(--primary-soft);
    border-left: 2px solid var(--primary-color);
  }

  a.router-link-exact-active svg {
    color: var(--primary-color) !important;
  }

  &__separator {
    margin: 0.5em 1em;
    border-top: 1px solid var(--border-color, #e0e0e0);
  }

  &__org-switch {
    cursor: pointer;
  }
}
</style>
