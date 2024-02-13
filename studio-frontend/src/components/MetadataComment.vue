<template>
  <section>
    <h4>Comment</h4>
    <p>{{ metadata.value.content }}</p>
  </section>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
export default {
  props: {
    metadata: {
      type: Object,
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
