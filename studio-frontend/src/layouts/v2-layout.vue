<template>
  <div class="v2-layout" :class="{ 'no-sidebar': !sidebarOpen || fullscreen }">
    <QuickSessionNotif />
    <div class="v2-layout__content">
      <aside
        v-if="!fullscreen"
        class="v2-layout__sidebar"
        :class="{ 'v2-layout__sidebar--hidden': !sidebarOpen }">
        <BurgerMenu :backoffice="backoffice">
          <slot name="sidebar"></slot>
        </BurgerMenu>
      </aside>
      <main class="v2-layout__main" @click="closeSidebar">
        <HeaderBar :breadcrumbItems="breadcrumbItems" :fullscreen="fullscreen">
          <template v-slot:breadcrumb-actions>
            <slot name="breadcrumb-actions"></slot>
          </template>
        </HeaderBar>
        <div
          :class="[
            'flex',
            'col',
            'flex1',
            'v2-layout__main-content',
            customClass ? customClass : '',
            box ? 'box' : '',
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
import Breadcrumb from "@/components/atoms/Breadcrumb.vue"
import HeaderBar from "@/components/HeaderBar.vue"
import LocalSwitcher from "@/components/LocalSwitcher.vue"
import QuickSessionNotif from "@/components/QuickSessionNotif.vue"

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
    breadcrumbItems: {
      type: Array,
      required: false,
    },
    // if true, the main content will be wrapped in centered instead of full width
    box: {
      type: Boolean,
      default: false,
    },
    // hide the sidebar
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
    ...mapGetters("system", ["sidebarOpen", "isMobile"]),
    ...mapGetters("quickSession", ["quickSession", "sessionBot"]),
  },
  beforeMount() {
    if (this.isMobile === false && this.sidebarOpen === undefined) {
      this.$store.dispatch("system/toggleSidebar", true)
    }
  },
  mounted() {},
  methods: {
    closeSidebar() {
      if (!this.isMobile || !this.sidebarOpen) return
      this.$store.dispatch("system/toggleSidebar")
    },
    toggleSidebar() {
      this.$store.dispatch("system/toggleSidebar")
    },
  },
  components: {
    Fragment,
    Breadcrumb,
    BurgerMenu,
    HeaderBar,
    LocalSwitcher,
    QuickSessionNotif,
  },
}
</script>

<style lang="scss">
.v2-layout {
  background-color: var(--background-app);
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
  padding: 0.5rem;
  &.no-sidebar {
    .v2-layout__content {
      padding-left: 0;
    }
  }
}

.v2-layout__content {
  display: flex;
  box-sizing: border-box;
  position: relative;
  padding-left: calc(300px + 0.5rem);
  flex: 1 1 auto;
  min-height: 0;
  transition: padding-left 0.3s ease-in-out;

  .v2-layout__sidebar {
    background-color: var(--background-primary);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--neutral-20);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    height: 100%;
    overflow: auto;
    transition: width 0.3s ease-in-out;
    z-index: 1000;
    box-sizing: border-box;

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
    background-color: var(--background-primary);
    border-radius: 4px;
    border: 1px solid var(--neutral-20);
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    container-type: size;
    container-name: main;

    .breadcrumb {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.5rem;
      flex-shrink: 0;
    }
  }

  .v2-layout__main-content {
    &.box {
      width: 900px;
      max-width: 100%;
      margin: auto;
      padding: 0px 1rem;
      box-sizing: border-box;
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
  height: 64px;
  width: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

@media only screen and (max-width: 1100px) {
  .v2-layout__content {
    //padding-left: 260px !important;
    transition: padding-left 0.3s ease-in-out;
    overflow: hidden !important;
    margin: 0;
    padding-left: 300px;

    .v2-layout__sidebar {
      //width: 260px !important;
      max-width: 100% !important;
      border: none !important;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.65);
      border-radius: 0px;
      transition: width 0.3s ease-in-out;
    }

    .v2-layout__main {
      border-radius: 0px;
      border: none;
    }
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
    box-sizing: border-box;

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
