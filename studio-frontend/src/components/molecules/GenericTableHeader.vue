<template>
  <thead>
    <tr v-if="mainHeader">
      <th v-if="selectable" class="no-size"></th>
      <th
        v-for="head in mainHeader"
        :colspan="head.col"
        :style="{ gridColumn: `span ${head.col}` }">
        {{ head.label }}
      </th>
    </tr>
    <tr>
      <th v-if="selectable">
        <Checkbox
          :id="randomId"
          :value="isAllSelected"
          :indeterminate="isIndeterminate"
          @input="toggleSelectAll" />
      </th>
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
import ArrayHeader from "@/components/ArrayHeader.vue"
import Checkbox from "@/components/atoms/Checkbox.vue"
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
    selectable: {
      type: Boolean,
      default: false,
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    allRowIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      randomId: Math.random().toString(36).substring(2, 15),
    }
  },
  mounted() {},
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.$emit("update:selectedRows", [])
      } else {
        this.$emit("update:selectedRows", [...this.allRowIds])
      }
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
    isAllSelected() {
      return (
        this.allRowIds.length > 0 &&
        this.selectedRows.length === this.allRowIds.length
      )
    },
    isIndeterminate() {
      return (
        this.selectedRows.length > 0 &&
        this.selectedRows.length < this.allRowIds.length
      )
    },
  },
  components: {
    ArrayHeader,
    Checkbox,
  },
}
</script>
