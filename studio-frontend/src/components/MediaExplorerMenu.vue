<template>
  <div class="media-explorer-menu-container flex col">
    <small v-if="currentOrganization" class="flex gap-medium">
      <span class="flex1">{{ currentOrganization.name }}</span>
      <router-link
        class="media-explorer-menu__org-settings"
        :aria-label="this.$t('navigation.organisation.setting')"
        :title="this.$t('navigation.organisation.setting')"
        :to="{
          name: 'organizations update',
          params: { organizationId: currentOrganizationScope },
        }">
        <ph-icon name="gear" class=""></ph-icon>
      </router-link>

      <div class="org-avatar">
        <Avatar
          :text="orgSymbol"
          size="sm"
          :color="colors.bg"
          :color-text="colors.text"
          @click="openOrganizationSelector">
        </Avatar>
        <span class="switch-icon">
          <ph-icon name="user-switch"></ph-icon>
        </span>
      </div>
    </small>
    <ModalSwitchOrg
      v-model="modalOrganizationSelector"
      @close="modalOrganizationSelector = false" />
    <div class="media-explorer-menu">
      <div class="media-explorer-menu__item">
        <router-link
          :to="{
            name: 'sessionsList',
            params: { organizationId: currentOrganizationScope },
          }"
          class="flex row align-center gap-medium tab">
          <ph-icon name="broadcast"></ph-icon>
          <span class="media-explorer-menu__item__text">
            {{ $t("navigation.tabs.sessions") }}
          </span>
        </router-link>
      </div>
      <div class="media-explorer-menu__item">
        <router-link
          :to="{
            name: 'explore',
            params: { organizationId: currentOrganizationScope },
          }"
          class="flex row align-center gap-medium tab">
          <ph-icon name="folder"></ph-icon>
          <span class="media-explorer-menu__item__text">
            {{ $t("navigation.tabs.explore") }}
          </span>
        </router-link>
      </div>

      <MediaExplorerMenuLabels class="media-explorer-menu__item" overlay>
        <span href="#" class="flex row justify-between gap-medium tab">
          <span class="flex row align-center gap-medium">
            <ph-icon name="tag"></ph-icon>
            <span class="media-explorer-menu__item__sub__item__text">
              {{ $t("navigation.tabs.explore_labels") }}
            </span>
          </span>
          <ModalTagManagement
            :selected-tags="selectedTags"
            @tag-click="handleTagClick">
            <template #trigger>
              <Button icon="plus" size="sm" color="primary">
                Add tag
              </Button>
            </template>
          </ModalTagManagement>
        </span>
      </MediaExplorerMenuLabels>
    </div>
    <hr />
    <small>Private Inbox</small>
    <div class="media-explorer-menu">
      <div class="media-explorer-menu__item">
        <router-link
          :to="{
            name: 'explore-favorites',
            params: { organizationId: currentOrganizationScope },
          }"
          class="flex row align-center gap-medium tab">
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
          class="flex row align-center gap-medium tab">
          <ph-icon name="share-network"></ph-icon>
          <span class="media-explorer-menu__item__sub__item__text">
            {{ $t("navigation.tabs.shared") }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import ModalSwitchOrg from "@/components/ModalSwitchOrg.vue"
import MediaExplorerMenuLabels from "@/components/MediaExplorerMenuLabels.vue"
import ModalTagManagement from "@/components/ModalTagManagement.vue"
import Button from "@/components/atoms/Button.vue"
export default {
  name: "MediaExplorerMenu",
  components: {
    ModalSwitchOrg,
    MediaExplorerMenuLabels,
    ModalTagManagement,
  },
  computed: {
    colors() {
      return {
        bg: "var(--primary-color)",
        text: "color-white",
      }
    },
    orgSymbol() {
      return this.currentOrganization?.name.length > 1
        ? this.currentOrganization.name.slice(0, 1)
        : this.currentOrganization.name
    },
    ...mapGetters("organizations", {
      organizations: "getOrganizations",
      currentOrganization: "getCurrentOrganization",
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
  },
  data() {
    return {
      active: false,
      activeLabels: false,
      modalOrganizationSelector: false,
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active
    },
    toggleLabels() {
      this.activeLabels = !this.activeLabels
    },
    openOrganizationSelector() {
      this.modalOrganizationSelector = true
    },
  },
}
</script>

<style lang="scss">
.media-explorer-menu {
  display: flex;
  flex-direction: column;

  &__org-settings {
    color: var(--text-primary);
  }

  &__item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    a {
      display: flex;
      align-items: center;
      gap: 1em;
      padding: 0.5em 1em;
      border-radius: 0px;
      background: var(--background-secondary);
    }

    a.active,
    a.router-link-exact-active {
      background: var(--primary-soft);
    }

    a.router-link-exact-active svg {
      color: var(--primary-color);
    }

    a.active {
      z-index: 1;
      background-image: linear-gradient(
        to right,
        var(--primary-soft),
        var(--neutral-40)
      );
      background-size: 200% 100%;
      background-position: 100% 0;
      animation: animate-background 5s infinite;

      @keyframes animate-background {
        0% {
          background-position: 100% 0;
        }
        50% {
          background-position: 0 0;
        }
        100% {
          background-position: 100% 0;
        }
      }

      &:hover {
        background-position: 0 0;
      }
    }
  }

  &__item__sub {
    display: flex;
    flex-direction: column;
    padding-left: 0.5em;
  }
}

.media-explorer-menu-container {
  hr {
    margin: 0;
    height: 0;
    border: none;
    border-top: 1px solid var(--neutral-40);
  }

  & > small {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75em;
    color: var(--neutral-60);
    padding: 1em;
    text-transform: uppercase;
  }
}

.org-avatar {
  cursor: pointer;
  position: relative;
  overflow: visible;

  .avatar {
    position: relative;
    z-index: 1;
  }

  span.switch-icon {
    position: absolute;
    right: -10px;
    top: -10px;
    z-index: 2;
    background-color: var(--primary-soft);
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--primary-color);
  }

  &:hover {
    span.switch-icon {
      background-color: var(--primary-color);
      color: var(--primary-soft);
    }
  }
}
</style>
