<template>
  <div class="main-content-container">
    <div class="main-content">
      <!-- <OrganizationSidebar v-if="sidebar" :organizationPage="organizationPage">
    </OrganizationSidebar> -->
      <aside class="main-content__sidebar">
        <BurgerMenu v-if="showBurgerMenu" @close="toggleBurger" v-click-outside="clickOutsideBurgerMenu"
          :organizationPage="organizationPage">
          <slot name="sidebar"></slot>
        </BurgerMenu>
      </aside>
      <main class="main-content__main flex col" :class="{ box: box, flex1: flex }">
        <HeaderBar />
        <div :class="[
          'flex',
          'col',
          'flex1',
          'main__content',
          customClass ? customClass : '',
          'scrollable',
        ]" :fullwidth="fullwidthContent">
          <slot></slot>
        </div>
      </main>
    </div>
    <div class="main-content-footer">
      &copy; 2020 - {{ new Date().getFullYear() }} - Linto API
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import isAuthenticated from "@/tools/isAuthenticated.js"

import BurgerMenu from "@/components-mobile/BurgerMenu.vue"
import OrganizationSidebar from "@/components/OrganizationSidebar.vue"
import Breadcrumb from "@/components/Breadcrumb.vue"
import HeaderBar from "@/components/HeaderBar.vue"

export default {
  props: {
    box: {
      type: Boolean,
      default: false,
    },
    sidebar: {
      type: Boolean,
      default: false,
    },
    flex: {
      type: Boolean,
      default: false,
    },
    organizationPage: {
      type: Boolean,
      default: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    noBreadcrumb: {
      type: Boolean,
      default: false,
    },
    fullwidthContent: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
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
  mounted() { },
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
.main-content-container {
  background-color: var(--background-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  margin: 1em;
  box-sizing: border-box;
  gap: 1em;
  position: relative;
  padding-left: 21em;
  flex: 1 1 auto;
  min-height: 0;

  .main-content__sidebar {
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: inset -.1em 0 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 20em;
    height: 100%;
    overflow: auto;
  }

  .main-content__main {
    background-color: white;
    border-radius: 4px;
    box-shadow: inset -.1em 0 0 rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.1);
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}

.main-content-footer {
  padding: 1em;
  padding-top: 0;
  font-size: .8em;
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