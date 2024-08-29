<template>
  <span :class="classList" :primary="primary">
    <span class="badge__content">
      <slot></slot>
    </span>
  </span>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    size: { type: String, default: "small" }, // small, medium, large
    primary: { type: Boolean, default: false },
  },
  data() {
    return {
      classList: ["badge", `badge--${this.size}`],
    }
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
