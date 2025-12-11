<template>
  <thead>
    <tr v-if="mainHeader">
      <th
        v-for="head in mainHeader"
        :colspan="head.col"
        :style="{ gridColumn: `span ${head.col}` }">
        {{ head.label }}
      </th>
    </tr>
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
    // { key, label, sortable, width, component, mainLabel}
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
  computed: {
    mainHeader() {
      const res = []
      let isEmpty = true
      for (const index in this.columns) {
        const column = this.columns[index]
        const mainLabel = column["mainLabel"]
        if (mainLabel) {
          isEmpty = false
          if (res.length > 0 && res[res.length - 1].label == mainLabel) {
            res[res.length - 1].col++
          } else {
            res.push({ label: mainLabel, col: 1 })
          }
        } else {
          res.push({ label: "", col: 1 })
        }
      }

      return isEmpty ? null : res
    },
  },
  components: {
    ArrayHeader,
  },
}
</script>
