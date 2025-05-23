<template>
  <div class="flex align-center header-bar">
    <input
      type="search"
      placeholder="Search"
      class="search-input header-bar__search" />
    <!-- <button class="transparent icon-only">
      <span class="icon filter" />
    </button> -->
    <CustomSelect
      buttonClass="transparent icon-only"
      v-model="selectedFilters"
      multipleSelection
      class="icon-only"
      :options="filterOptions">
      <template slot="button-content"><span class="icon filter" /></template>
    </CustomSelect>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import CustomSelect from "./molecules/CustomSelect.vue"
export default {
  props: {},
  data() {
    return {
      filterOptions: {
        tags: [
          { value: "tag1", text: "tag1" },
          { value: "tag2", text: "tag2" },
          { value: "tag3", text: "tag3" },
        ],
      },
      selectedFilters: [],
    }
  },
  mounted() {},
  methods: {},
  components: {
    CustomSelect,
  },
}
</script>
