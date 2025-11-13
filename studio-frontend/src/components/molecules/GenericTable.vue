<template>
  <table class="table-grid" :style="style">
    <GenericTableHeader
      @list_sort_by="sortBy"
      :columns="columns"
      :sortListDirection="sortListDirection"
      :sortListKey="sortListKey" />
    <tbody>
      <div class="table-loader" v-if="loading">
        <Loading />
      </div>
      <GenericTableLine
        v-for="line of content"
        :key="line[idKey]"
        :line="line"
        :columns="columns">
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
  },
  data() {
    return {}
  },
  mounted() {
    console.log("table generic", this.$scopedSlots)
  },
  methods: {
    sortBy(event) {
      this.$emit("list_sort_by", event)
    },
  },
  computed: {
    style() {
      return {
        "grid-template-columns": this.columns
          .map((column) => column.width)
          .join(" "),
      }
    },
  },
  components: {
    GenericTableHeader,
    GenericTableLine,
  },
}
</script>
