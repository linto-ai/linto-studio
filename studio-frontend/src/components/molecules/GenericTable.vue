<template>
  <table class="table-grid" :style="style">
    <GenericTableHeader
      @list_sort_by="sortBy"
      @update:selectedRows="updateSelectedRows"
      :columns="columns"
      :sortListDirection="sortListDirection"
      :sortListKey="sortListKey"
      :selectable="selectable"
      :selectedRows="selectedRows"
      :allRowIds="allRowIds">
      <template v-for="(_, slot) in headerSlots" #[slot]>
        <slot :name="slot"></slot>
      </template>
    </GenericTableHeader>
    <tbody>
      <div class="table-loader" v-if="loading">
        <Loading />
      </div>
      <GenericTableLine
        v-for="line of content"
        :key="line[idKey]"
        :line="line"
        :columns="columns"
        :selectable="selectable"
        :selectedRows="selectedRows"
        :idKey="idKey"
        @update:selectedRows="updateSelectedRows">
        <template v-for="(_, slot) in $scopedSlots" #[slot]="props">
          <slot
            :name="slot"
            :id="line[idKey]"
            :element="line"
            v-bind="props"></slot>
        </template>
      </GenericTableLine>
    </tbody>
  </table>
</template>
<script>
import GenericTableHeader from "./GenericTableHeader.vue"
import GenericTableLine from "./GenericTableLine.vue"

export default {
  props: {
    // [{ key, label, sortable, width, component, mainLabel }]
    columns: {
      type: Array,
      required: true,
    },
    content: {
      type: Array,
      default: () => [],
    },
    loading: {
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
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
    updateSelectedRows(newSelection) {
      this.$emit("update:selectedRows", newSelection)
    },
  },
  computed: {
    headerSlots() {
      const slots = {}
      for (const name in this.$scopedSlots) {
        if (name.startsWith("header-")) {
          slots[name] = this.$scopedSlots[name]
        }
      }
      return slots
    },
    style() {
      const columnsWidth = this.columns.map((column) => column.width).join(" ")
      return {
        "grid-template-columns": this.selectable
          ? `auto ${columnsWidth}`
          : columnsWidth,
      }
    },
    allRowIds() {
      return this.content.map((row) => row[this.idKey])
    },
  },
  components: {
    GenericTableHeader,
    GenericTableLine,
  },
}
</script>
