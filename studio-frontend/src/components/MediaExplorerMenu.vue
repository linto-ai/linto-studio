<template>
  <div class="media-explorer-menu flex col">
    <router-link
      :to="{
        name: 'explore',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="tray" :weight="$route.name === 'explore' ? 'fill' : 'regular'"></ph-icon>
      <span class="media-explorer-menu__item__text">
        {{ $t("navigation.tabs.explore") }}
      </span>
    </router-link>

    <router-link
      v-if="hasSessions"
      :to="{
        name: 'sessionsList',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="broadcast" :weight="$route.name === 'sessionsList' ? 'fill' : 'regular'"></ph-icon>
      <span class="media-explorer-menu__item__text">
        {{ $t("navigation.tabs.sessions") }}
      </span>
    </router-link>

    <router-link
      :to="{
        name: 'explore-favorites',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="star" :weight="$route.name === 'explore-favorites' ? 'fill' : 'regular'"></ph-icon>
      <span class="media-explorer-menu__item__sub__item__text">
        {{ $t("navigation.tabs.favorites") }}
      </span>
    </router-link>
    <router-link
      :to="{
        name: 'explore-shared',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="share-network" :weight="$route.name === 'explore-shared' ? 'fill' : 'regular'"></ph-icon>
      <span class="media-explorer-menu__item__sub__item__text">
        {{ $t("navigation.tabs.shared") }}
      </span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import { apiHasSessions } from "@/api/session.js"

export default {
  name: "MediaExplorerMenu",
  components: {},
  computed: {
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
  },
  data() {
    return {
      hasSessions: false,
    }
  },
  watch: {
    currentOrganizationScope: {
      immediate: true,
      async handler(orgId) {
        if (orgId) {
          this.hasSessions = await apiHasSessions(orgId)
        } else {
          this.hasSessions = false
        }
      },
    },
  },
  methods: {},
}
</script>

<style lang="scss">
.media-explorer-menu {
  display: flex;
  flex-direction: column;

  &__item {
    padding: 0.5rem 1rem;
    border-left: 2px solid transparent;

    &.router-link-exact-active {
      background: var(--primary-soft);
      border-left: 2px solid var(--primary-color);
    }

    &.router-link-exact-active svg {
      color: var(--primary-color) !important;
    }
  }
}
</style>
