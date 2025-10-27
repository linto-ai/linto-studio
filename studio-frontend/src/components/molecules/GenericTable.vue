<template>
  <div>
    <GenericTableHeader :columns="columns" />
    <GenericTableLine v-for="line of content" :key="line[idKey]" :line="line" />
  </div>
</template>
<script>
import { bus } from "@/main.js"
import GenericTableHeader from "./GenericTableHeader.vue"
import GenericTableLine from "./GenericTableLine.vue"
export default {
  props: {
    // { key, label, sortable, width, component}
    columns: {
      type: Array,
      required: true,
    },
    content: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectedRows: {
      type: Array,
      default: [],
    },
    idKey: {
      type: String,
      default: "_id",
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
}
</script>
