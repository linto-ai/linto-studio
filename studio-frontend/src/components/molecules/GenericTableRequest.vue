<template>
  <GenericTable
    :columns="columns"
    :content="data"
    :loading="loading"
    :selectedRows="selectedRows"
    :idKey="idKey"
    :sortListDirection="sortListDirection"
    :sortListKey="sortListKey">
    <template v-for="(_, slot) in $scopedSlots" #[slot]="props">
      <slot :name="slot" v-bind="props"></slot>
    </template>
  </GenericTable>
</template>
<script>
import { bus } from "@/main.js"
import { debounceMixin } from "@/mixins/debounce.js"
import GenericTable from "./GenericTable.vue"

export default {
  mixins: [debounceMixin],
  props: {
    fetchMethod: {
      type: Function,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
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
    return {
      loading: true,
      data: [],
      count: 0,
      selectedLines: [],
      currentPageNb: 0,
      search: "",
      totalPagesNumber: 0,
    }
  },
  mounted() {
    this.debouncedFetchData()
  },
  methods: {
    async fetchData() {
      return await this.fetchMethod(this.currentPageNb, {
        sortField: this.sortListKey,
        sortOrder: this.sortListDirection === "asc" ? 1 : -1,
      })
    },
    async debouncedFetchData() {
      this.loading = true
      const req = await this.debouncedSearch(
        this.fetchData.bind(this),
        this.search,
      )
      console.log(req)
      this.data = req.list
      this.count = req.count
      this.totalPagesNumber = Math.ceil(req.count / 10)
      this.loading = false
    },
    removeElement(id) {
      this.data = this.data.filter((d) => d[this.idKey] !== id)
      console.log("rem", this.data)
    },
  },
  components: { GenericTable },
}
</script>
