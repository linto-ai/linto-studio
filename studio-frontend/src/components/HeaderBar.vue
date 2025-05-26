<template>
  <div class="flex align-center header-bar">
    <form class="flex row align-center flex1 gap-small" @submit="handleSearch">
      <div class="flex row align-center">
        <input
          v-model="search"
          type="search"
          placeholder="Search"
          class="header-bar__search" />
        <button type="submit" class="transparent icon-only">
          <span class="icon search" />
        </button>
        <button
          v-if="search"
          type="reset"
          class="transparent icon-only"
          @click="clearSearch">
          <span class="icon close" />
        </button>
      </div>
      <!-- <CustomSelect
        buttonClass="transparent icon-only"
        v-model="selectedFilters"
        multipleSelection
        class="icon-only"
        :options="filterOptions">
        <template slot="button-content"><span class="icon filter" /></template>
      </CustomSelect> -->
    </form>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { mapGetters } from "vuex"

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
      search: this.$route.query.q || "",
    }
  },
  mounted() {},
  computed: {
    ...mapGetters("organizations", {
      currentOrganizationScope: "getCurrentOrganizationScope",
    }),
  },
  methods: {
    handleSearch(e) {
      e.preventDefault()
      this.$router.push({
        name: "explore",
        query: { q: this.search },
        params: { organizationId: this.currentOrganizationScope },
      })
      return false
    },
    clearSearch() {
      this.$router.push({
        name: "explore",
        query: { q: "" },
        params: { organizationId: this.currentOrganizationScope },
      })
    },
  },
  components: {
    CustomSelect,
  },
}
</script>
