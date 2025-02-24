<template>
  <div class="flex wrap gap-small">
    <Tag
      :key="index"
      v-for="(pairs, index) in field.value"
      :value="pairs[1]"
      :categoryName="pairs[0]" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import Tag from "./Tag.vue"
export default {
  props: {
    field: {
      type: Object, // field.value is a list of [key, value] (from Object.entries())
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {
    Tag,
  },
}
</script>
