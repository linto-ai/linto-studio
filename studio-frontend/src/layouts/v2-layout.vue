<template>
  <div class="v2-layout">
    <div class="v2-layout__content">
      <aside class="v2-layout__sidebar">
        <BurgerMenu :backoffice="backoffice">
          <slot name="sidebar"></slot>
        </BurgerMenu>
      </aside>
      <main class="v2-layout__main">
        <HeaderBar />
        <Breadcrumb>
          <template v-slot:breadcrumb-actions>
            <slot name="breadcrumb-actions"></slot>
          </template>
        </Breadcrumb>
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

import BurgerMenu from "@/components-mobile/BurgerMenu.vue"
import OrganizationSidebar from "@/components/OrganizationSidebar.vue"
import Breadcrumb from "@/components/atoms/Breadcrumb.vue"
import HeaderBar from "@/components/HeaderBar.vue"

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
      showBurgerMenu: true,
    }
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
  },
  mounted() {},
  methods: {
    clickOutsideBurgerMenu() {
      if (
        this.showBurgerMenu &&
        window.matchMedia("(max-width: 1100px)").matches
      ) {
        this.toggleBurger()
      }
    },
    toggleBurger() {
      this.showBurgerMenu = !this.showBurgerMenu
      bus.$emit("toggle-burger", this.showBurgerMenu)
    },
  },
  components: {
    Fragment,
    Breadcrumb,
    OrganizationSidebar,
    BurgerMenu,
    HeaderBar,
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

  .v2-layout__sidebar {
    background-color: var(--background-secondary);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 20em;
    height: 100%;
    overflow: auto;
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
      padding: 0 .5rem;
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
</style>
