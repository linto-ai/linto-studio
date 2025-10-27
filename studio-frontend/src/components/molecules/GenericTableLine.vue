<template>
  <tr>
    <td v-for="column in columns" :key="column.key">
      {{ line[column.key] }}
    </td>
  </tr>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    line: {
      type: Object,
      required: true,
    },
    // { key, label, sortable, width, component}
    columns: {
      type: Array,
      required: true,
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
