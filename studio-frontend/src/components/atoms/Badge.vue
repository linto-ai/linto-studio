<template>
  <span :class="classList" :primary="primary" :inverted="inverted">
    <span class="badge__content">
      <slot></slot>
    </span>
  </span>
</template>
<script>
import { Fragment } from "vue-fragment"
export default {
  name: "Badge",
  props: {
    size: { type: String, default: "small" }, // small, medium, large
    primary: { type: Boolean, default: false },
    inverted: { type: Boolean, default: false },
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
