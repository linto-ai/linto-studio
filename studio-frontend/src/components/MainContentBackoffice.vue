<template>
  <V2Layout backoffice>
    <ActionBar>
      <slot name="header"></slot>
    </ActionBar>
    <div class="flex1 backoffice-main">
      <slot v-if="!loading"></slot>
      <Loading v-else />
    </div>
  </V2Layout>
</template>
<script>
import Loading from "@/components/atoms/Loading.vue"
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
  components: { Loading, V2Layout, ActionBar },
}
</script>
