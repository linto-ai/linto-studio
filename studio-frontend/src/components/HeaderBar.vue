<template>
  <div class="flex align-center header-bar button-group">
    <div class="flex align-center header-bar__left">
      <button-popover></button-popover>
      <custom-select :options="filterOptions" :value="selectedFilters">
        <template #button-content>
          <ph-icon name="user" size="md" />
          <span class="label">User</span>
        </template>
      </custom-select>
      <!--
      <form class="flex row align-center flex1" @submit="handleSearch">
        <input v-model="search" type="search" name="q" placeholder="Search something…" class="header-bar__search flex1"
          ref="searchInput" />
        <button type="submit" class="transparent">
          <ph-icon name="MagnifyingGlass" size="md" />
          <span class="label">Search</span>
        </button>
        <button v-if="search" type="reset" class="transparent icon-only" @click="clearSearch">
          <span class="icon close" />
        </button>
        <CustomSelect
        buttonClass="transparent icon-only"
        v-model="selectedFilters"
        multipleSelection
        class="icon-only"
        :options="filterOptions">
        <template slot="button-content"><span class="icon filter" /></template>
</CustomSelect>
      </form> -->
    </div>
    <div class="header-bar__right">
      <MediaExplorerStorageSize />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

import ButtonPopover from "./atoms/ButtonPopover.vue"
import CustomSelect from "./molecules/CustomSelect.vue"
import PhIcon from "./atoms/PhIcon.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"

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
  mounted() {
    // autofocus when user type [CMD] + K
    document.addEventListener("keydown", (e) => {
      if (e.metaKey && e.key === "k") {
        this.$refs.searchInput.focus()
      }
    })
  },
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
    PhIcon,
    CustomSelect,
    ButtonPopover,
    MediaExplorerStorageSize,
  },
}
</script>
