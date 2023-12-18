<template>
  <div class="menuToolbox">
    <h2 class="flex row gap-small align-center">
      <span class="flex1">{{ title }}</span>
      <span class="icon plus"></span>
    </h2>
    <ul v-if="open" class="menuToolbox__options">
      <li>Export</li>
      <li>Delete</li>
      <li>Share</li>
    </ul>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    title: { type: String, required: true },
    open: { type: Boolean, required: true },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
