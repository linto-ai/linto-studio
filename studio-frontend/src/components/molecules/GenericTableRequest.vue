<template>
  <div>
    <GenericTable
      @list_sort_by="sortBy"
      @update:selectedRows="updateSelectedRows"
      :columns="columns"
      :content="data"
      :loading="loading"
      :selectedRows="selectedRows"
      :idKey="idKey"
      :sortListDirection="sortListDirection"
      :sortListKey="sortListKey"
      :selectable="selectable">
      <template v-for="(_, slot) in $scopedSlots" #[slot]="props">
        <slot :name="slot" v-bind="props"></slot>
      </template>
    </GenericTable>
    <Pagination
      :pages="totalPagesNumber"
      v-model="currentPageNb"
      v-if="count > 0"></Pagination>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { debounceMixin } from "@/mixins/debounce.js"
import GenericTable from "./GenericTable.vue"
import Pagination from "./Pagination.vue"
export default {
  mixins: [debounceMixin],
  props: {
    fetchMethod: {
      type: Function,
      required: true,
    },
    fetchMethodParams: {
      type: Object,
      default: () => ({}),
      required: false,
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
    initSortListDirection: {
      type: String,
      required: true,
    },
    initSortListKey: {
      type: String,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
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
      sortListDirection: this.initSortListDirection,
      sortListKey: this.initSortListKey,
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
        ...this.fetchMethodParams,
      })
    },
    async debouncedFetchData() {
      this.loading = true
      const req = await this.debouncedSearch(
        this.fetchData.bind(this),
        this.search,
      )
      this.data = req.list
      this.count = req.count
      this.totalPagesNumber = Math.ceil(req.count / 10)
      this.loading = false
    },
    removeElement(id) {
      this.data = this.data.filter((d) => d[this.idKey] !== id)
      console.log("rem", this.data)
    },
    updateElement(id, newElement) {
      this.data = this.data.map((d) => {
        if (d[this.idKey] === id) {
          return { ...d, ...newElement }
        }
        return d
      })
    },
    reset() {
      this.currentPageNb = 0
      this.search = ""
      this.selectedLines = []
      this.debouncedFetchData()
    },
    sortBy(key) {
      if (key === this.sortListKey) {
        this.sortListDirection =
          this.sortListDirection === "desc" ? "asc" : "desc"
      } else {
        this.sortListDirection = "desc"
      }
      this.sortListKey = key
      this.debouncedFetchData()
    },
    updateSelectedRows(newSelection) {
      this.$emit("update:selectedRows", newSelection)
    },
  },
  watch: {
    currentPageNb() {
      this.debouncedFetchData()
    },
    fetchMethod() {
      if (this.currentPageNb == 0) {
        this.debouncedFetchData()
      } else {
        this.currentPageNb = 0 // will trigger debouncedFetchData
      }
    },
    fetchMethodParams: {
      handler() {
        console.log("fetchMethodParams changed", this.fetchMethodParams)
        if (this.currentPageNb == 0) {
          this.debouncedFetchData()
        } else {
          this.currentPageNb = 0 // will trigger debouncedFetchData
        }
      },
      deep: true,
    },
  },
  components: { GenericTable, Pagination },
}
</script>
