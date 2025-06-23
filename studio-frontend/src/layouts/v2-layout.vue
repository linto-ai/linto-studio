<template>
  <div class="v2-layout" :class="{ 'no-sidebar': !sidebarOpen }">
    <div class="v2-layout__content">
      <aside
        class="v2-layout__sidebar"
        :class="{ 'v2-layout__sidebar--hidden': !sidebarOpen }">
        <BurgerMenu :backoffice="backoffice">
          <slot name="sidebar"></slot>
        </BurgerMenu>
      </aside>
      <main class="v2-layout__main" @click="closeSidebar">
        <HeaderBar :hasHeaderBarSlot="hasHeaderBarSlot">
          <template v-if="!hasHeaderBarSlot" v-slot:header-bar-left>
            <Button
              icon="sidebar"
              border-color="transparent"
              color="neutral"
              @click.stop="toggleSidebar"
              class="sidebar-toggle icon-only" />
            <Breadcrumb />
          </template>
          <template v-if="!hasHeaderBarSlot" v-slot:header-bar-right>
            <LocalSwitcher class="local-switcher"></LocalSwitcher>
          </template>
          <template v-slot:breadcrumb>
            <Breadcrumb>
              <template v-slot:breadcrumb-actions>
                <slot name="breadcrumb-actions"></slot>
              </template>
            </Breadcrumb>
          </template>
        </HeaderBar>
        <div
          :class="[
            'flex',
            'col',
            'flex1',
            'v2-layout__main-content',
            customClass ? customClass : '',
            'scrollable',
          ]">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import isAuthenticated from "@/tools/isAuthenticated.js"
import { mapGetters } from "vuex"

import BurgerMenu from "@/components-mobile/BurgerMenu.vue"
import OrganizationSidebar from "@/components/OrganizationSidebar.vue"
import Breadcrumb from "@/components/atoms/Breadcrumb.vue"
import HeaderBar from "@/components/HeaderBar.vue"
import LocalSwitcher from "@/components/LocalSwitcher.vue"

export default {
  props: {
    customClass: {
      type: String,
      default: "",
    },
    backoffice: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    }
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
    hasHeaderBarSlot() {
      return !!this.$slots["header-bar"]
    },
    ...mapGetters("system", ["sidebarOpen"]),
  },
  mounted() {},
  methods: {
    closeSidebar() {
      if (!this.sidebarOpen) return
      this.$store.dispatch("system/toggleSidebar")
    },
    toggleSidebar() {
      this.$store.dispatch("system/toggleSidebar")
    },
  },
  components: {
    Fragment,
    Breadcrumb,
    OrganizationSidebar,
    BurgerMenu,
    HeaderBar,
    LocalSwitcher,
  },
}
</script>

<style lang="scss">
.v2-layout {
  background-color: var(--background-app);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;

  &.no-sidebar {
    .v2-layout__content {
      padding-left: 0;
    }
  }
}

.v2-layout__content {
  display: flex;
  margin: 0.5em;
  box-sizing: border-box;
  gap: 1em;
  position: relative;
  padding-left: 20.5em;
  flex: 1 1 auto;
  min-height: 0;
  transition: padding-left 0.3s ease-in-out;

  .v2-layout__sidebar {
    background-color: var(--background-secondary);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    transition: width 0.3s ease-in-out;
    z-index: 1000;

    nav {
      width: 100%;
      overflow: auto;
    }

    &--hidden {
      width: 0;
      border: none;

      .burger-menu {
        overflow: auto;

        .card-credits {
          display: none;
        }
      }
    }
  }

  .v2-layout__main {
    background-color: var(--background-secondary);
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
      border-bottom: 1px solid var(--border-color, #e9ecef);
      background-color: var(--background-breadcrumb, rgba(248, 249, 250, 0.8));
      flex-shrink: 0;
    }
  }
}

.v2-layout__footer {
  padding: 1em;
  padding-top: 0;
  font-size: 0.8em;
  color: var(--text-secondary);
  display: flex;
  justify-content: flex-end;
  height: 3em;
}

.scrollable {
  overflow-y: auto;
  overflow-x: hidden;
}

.local-switcher {
  margin-right: 0.5em;
}

.sidebar-toggle {
  height: 54px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

@media only screen and (max-width: 1100px) {
  .v2-layout__sidebar {
    width: 260px !important;
    max-width: 100% !important;
    border: none !important;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.65);
    transition: width 0.3s ease-in-out;
  }

  .v2-layout__content {
    padding-left: 260px !important;
    transition: padding-left 0.3s ease-in-out;
    overflow: hidden !important;

    main {
      width: 100vw !important;
      max-width: 100vw !important;
      min-width: 100vw !important;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 100;
      }
    }
  }

  .v2-layout.no-sidebar {
    .v2-layout__sidebar {
      width: 0 !important;
      border: none !important;
    }

    .v2-layout__content {
      padding-left: 0 !important;

      main {
        min-width: auto !important;
        &::before {
          display: none;
        }
      }
    }
  }
}
</style>
