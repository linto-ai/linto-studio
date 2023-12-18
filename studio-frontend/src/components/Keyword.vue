<template>
  <div class="keyword">
    {{ value }}
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
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
  components: { Fragment },
}
</script>
