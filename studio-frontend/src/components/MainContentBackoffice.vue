<template>
  <V2Layout backoffice>
    <template v-slot:header-bar>
      <slot name="header"></slot>
    </template>
    <div class="flex1 backoffice-main">
      <slot v-if="!loading"></slot>
      <Loading v-else />
    </div>
  </V2Layout>
</template>
<script>
import BackofficeSidebar from "@/components/BackofficeSidebar.vue"
import Loading from "@/components/Loading.vue"
import V2Layout from "@/layouts/v2-layout.vue"
import ActionBar from "@/layouts/ActionBar.vue"

export default {
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { BackofficeSidebar, Loading, V2Layout, ActionBar },
}
</script>
