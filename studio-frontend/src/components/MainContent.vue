<template>
  <div class="flex flex1">
    <!-- <OrganizationSidebar v-if="sidebar" :organizationPage="organizationPage">
    </OrganizationSidebar> -->
    <BurgerMenu
      v-if="showBurgerMenu"
      @close="toggleBurger"
      v-click-outside="clickOutsideBurgerMenu"
      :organizationPage="organizationPage">
      <slot name="sidebar"></slot>
    </BurgerMenu>
    <main class="flex col scrollable" :class="{ box: box, flex1: flex }">
      <!-- <div
        class="flex row align-center main__breadcrumb-bar gap-small"
        v-if="!fullscreen && this.$slots['breadcrumb-actions']">
        <button
          v-if="isAuthenticated"
          class="transparent only-icon burger-button mobile"
          @click="toggleBurger">
          <span class="icon burger"></span>
        </button>
        <!-- <div
          class="flex row align-center flex1 reset-overflows"
          v-if="!noBreadcrumb">
          <!-- <Breadcrumb /> 
        </div> -->
      <!--  
        <slot name="breadcrumb-actions"></slot>
      </div> -->
      <HeaderBar />
      <div
        :class="[
          'flex',
          'col',
          'flex1',
          'main__content',
          customClass ? customClass : '',
        ]"
        :fullwidth="fullwidthContent">
        <slot></slot>
      </div>
    </main>
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
