<template>
  <thead>
    <tr>
      <ArrayHeader
        v-for="column in columns"
        @list_sort_by="sortBy"
        :label="column.label"
        :sortListDirection="sortListDirection"
        :sortListKey="sortListKey"
        :eventLabel="column.key" />
    </tr>
  </thead>
</template>
<script>
import { bus } from "@/main.js"
import ArrayHeader from "@/components/ArrayHeader.vue"
export default {
  props: {
    // { key, label, sortable, width, component}
    columns: {
      type: Array,
      required: true,
    },
    sortListDirection: {
      type: String,
      required: true,
    },
    sortListKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
  },
  components: {
    ArrayHeader,
  },
}
</script>
