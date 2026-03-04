<template>
  <tr
    @click="onRowClick"
    :class="[{ 'selectable-row': selectable, selected: isSelected }, rowClass?.(line)]">
    <td v-if="selectable && selectMode !== 'single'">
      <Checkbox
        v-model="p_selectedRows"
        :id="line[idKey]"
        :checkboxValue="line[idKey]"
        @click.native.stop />
    </td>
    <td v-else-if="selectable">
      <Radio
        :value="selectedRows[0] ?? null"
        :radioValue="line[idKey]"
        name="generic-table-radio"
        @input="selectSingle"
        @click.native.stop />
    </td>
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
import GenericTableCell from "./GenericTableCell.vue"
import Checkbox from "@/components/atoms/Checkbox.vue"
import Radio from "@/components/atoms/Radio.vue"
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
    selectable: {
      type: Boolean,
      default: false,
    },
    selectedRows: {
      type: Array,
      default: () => [],
    },
    idKey: {
      type: String,
      default: "_id",
    },
    selectMode: {
      type: String,
      default: "multiple",
    },
    rowClass: {
      type: Function,
      default: null,
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
    toggleSelection() {
      const id = this.line[this.idKey]
      if (this.selectMode === "single") {
        this.$emit("update:selectedRows", [id])
        return
      }
      let newSelection
      if (this.isSelected) {
        newSelection = this.selectedRows.filter((rowId) => rowId !== id)
      } else {
        newSelection = [...this.selectedRows, id]
      }
      this.$emit("update:selectedRows", newSelection)
    },
    selectSingle(value) {
      this.$emit("update:selectedRows", [value])
    },
    onRowClick() {
      if (this.selectable) {
        this.toggleSelection()
      }
    },
  },
  computed: {
    isSelected() {
      return this.selectedRows.includes(this.line[this.idKey])
    },
    p_selectedRows: {
      get() {
        return this.selectedRows
      },
      set(value) {
        this.$emit("update:selectedRows", value)
      },
    },
  },
  components: { GenericTableCell, Checkbox, Radio },
}
</script>
<style lang="scss" scoped>
.selectable-row {
  cursor: pointer;

  &:hover {
    background-color: var(--neutral-10);
  }

  &.selected {
    background-color: var(
      --primary-color-light,
      rgba(var(--primary-color-rgb), 0.1)
    );
  }
}
</style>
