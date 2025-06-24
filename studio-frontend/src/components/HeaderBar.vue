<template>
  <div class="flex align-center header-bar">
    <Button
      icon="sidebar"
      border-color="transparent"
      color="neutral"
      @click.stop="toggleSidebar"
      class="sidebar-toggle icon-only" />
    <Breadcrumb class="flex1" :additionalbreadcrumbItems="breadcrumbItems">
      <template v-slot:breadcrumb-actions>
        <slot name="breadcrumb-actions"></slot>
      </template>
    </Breadcrumb>
    <LocalSwitcher class="local-switcher"></LocalSwitcher>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

import ActionConversationCreate from "./molecules/ActionConversationCreate.vue"
import CustomSelect from "./molecules/CustomSelect.vue"
import PhIcon from "./atoms/PhIcon.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"
import LocalSwitcher from "./LocalSwitcher.vue"
import Breadcrumb from "@/components/atoms/Breadcrumb.vue"

export default {
  props: {
    breadcrumbItems: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      simplePopoverOpen: false,
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
    hasHeaderBarSlot() {
      return !!this.$slots["header-bar"]
    },
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
    toggleSidebar() {
      this.$store.dispatch("system/toggleSidebar")
    },
  },
  components: {
    ActionConversationCreate,
    PhIcon,
    CustomSelect,
    MediaExplorerStorageSize,
    LocalSwitcher,
    Breadcrumb,
  },
}
</script>
