<template>
  <div class="flex flex1">
    <OrganizationSidebar v-if="sidebar" :organizationPage="organizationPage">
      <slot name="sidebar"></slot>
    </OrganizationSidebar>
    <BurgerMenu />
    <main class="flex col scrollable" :class="{ box: box, flex1: flex }">
      <div
        class="flex row align-center main__breadcrumb-bar"
        v-if="!fullscreen">
        <button class="transparent only-icon mobile burger-button">
          <span class="icon burger"></span>
        </button>
        <div
          class="flex row align-center flex1 reset-overflows"
          v-if="!noBreadcrumb">
          <Breadcrumb />
        </div>
        <slot name="breadcrumb-actions"></slot>
      </div>
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
import { bus } from "../main.js"
import Breadcrumb from "./Breadcrumb.vue"
import OrganizationSidebar from "./OrganizationSidebar.vue"
import BurgerMenu from "@/components-mobile/BurgerMenu.vue"

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
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment, Breadcrumb, OrganizationSidebar, BurgerMenu },
}
</script>
