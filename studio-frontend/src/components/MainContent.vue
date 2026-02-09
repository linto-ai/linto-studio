<template>
  <V2Layout>
    <slot></slot>
  </V2Layout>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import isAuthenticated from "@/tools/isAuthenticated.js"

import V2Layout from "@/layouts/v2-layout.vue"

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
    V2Layout,
  },
}
</script>

<style lang="scss"></style>
