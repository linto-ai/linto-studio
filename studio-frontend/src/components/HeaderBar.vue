<template>
  <div class="flex align-center header-bar">
    <slot name="header-bar"></slot>

    <div v-if="!hasHeaderBarSlot" class="flex align-center header-bar__left">
      <slot name="header-bar-left"></slot>
    </div>
    <div v-if="!hasHeaderBarSlot" class="header-bar__right">
      <slot name="header-bar-right"></slot>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

import ActionConversationCreate from "./molecules/ActionConversationCreate.vue"
import CustomSelect from "./molecules/CustomSelect.vue"
import PhIcon from "./atoms/PhIcon.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"
import LocalSwitcher from "./LocalSwitcher.vue"

export default {
  props: {},
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
  },
  components: {
    ActionConversationCreate,
    PhIcon,
    CustomSelect,
    MediaExplorerStorageSize,
    LocalSwitcher,
  },
}
</script>
