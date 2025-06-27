<template>
  <div class="media-explorer-menu flex col">
    <router-link
      :to="{
        name: 'explore',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="Tray"></ph-icon>
      <span class="media-explorer-menu__item__text">
        {{ $t("navigation.tabs.explore") }}
      </span>
    </router-link>

    <router-link
      :to="{
        name: 'sessionsList',
        params: { organizationId: currentOrganizationScope },
      }"
      class="flex row align-center gap-medium media-explorer-menu__item">
      <ph-icon name="broadcast"></ph-icon>
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
      <ph-icon name="star"></ph-icon>
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
      <ph-icon name="share-network"></ph-icon>
      <span class="media-explorer-menu__item__sub__item__text">
        {{ $t("navigation.tabs.shared") }}
      </span>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
// import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"
// import MediaExplorerMenuLabels from "@/components/MediaExplorerMenuLabels.vue"
// import ModalTagManagement from "@/components/ModalTagManagement.vue"
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
    return {}
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
