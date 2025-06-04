<template>
  <header class="action-bar">
    <slot></slot>
  </header>
</template>
<script>
import { bus } from "@/main.js"
export default {
  name: "ActionBar",
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
.action-bar {
  height: 54px;
  background-color: var(--primary-soft);
  box-sizing: border-box;
  display: flex;
  padding: 0 1rem;
  border-bottom: var(--border-block);
}
</style>
