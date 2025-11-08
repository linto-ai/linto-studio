<template>
  <div class="keyword">
    {{ value }}
  </div>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
}
</script>
