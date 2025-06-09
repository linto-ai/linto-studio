<template>
  <div class="flex align-center header-bar">
    <div class="flex align-center header-bar__left">
      <action-conversation-create />
    </div>
    <div class="header-bar__right">
      <MediaExplorerStorageSize />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

import ActionConversationCreate from "./molecules/ActionConversationCreate.vue"
import CustomSelect from "./molecules/CustomSelect.vue"
import PhIcon from "./atoms/PhIcon.vue"
import MediaExplorerStorageSize from "./MediaExplorerStorageSize.vue"

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
  },
}
</script>
