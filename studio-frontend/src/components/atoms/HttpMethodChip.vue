<template>
  <Chip :color="color" :value="HttpMethod" />
</template>
<script>
import { bus } from "@/main.js"
import Chip from "@/components/atoms/Chip.vue"
export default {
  props: {
    HttpMethod: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    color() {
      if (this.HttpMethod == "GET") return "var(--success-color)"
      if (this.HttpMethod == "POST") return "var(--warning-color)"
      if (this.HttpMethod == "DELETE") return "var(--danger-color)"
      return null
    },
  },
  components: {
    Chip,
  },
}
</script>
