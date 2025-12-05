<template>
  <tr>
    <GenericTableCell
      v-for="column in columns"
      :key="column.key"
      :value="getNestedProperty(line, column.key)"
      :transformValue="column.transformValue">
      <template
        #default="defaultProps"
        v-if="$scopedSlots[`cell-${column.key}`]">
        <slot :name="`cell-${column.key}`" v-bind="defaultProps"></slot>
      </template>
    </GenericTableCell>
  </tr>
</template>
<script>
import { bus } from "@/main.js"
import GenericTableCell from "./GenericTableCell.vue"
import getNestedProperty from "@/tools/getNestedProperty"
export default {
  props: {
    line: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    getNestedProperty(obj, path) {
      return getNestedProperty(obj, path)
    },
  },
  computed: {},
  components: { GenericTableCell },
}
</script>
