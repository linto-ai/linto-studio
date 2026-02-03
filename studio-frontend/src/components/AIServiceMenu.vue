<template>
  <div class="ai-menu">
    <Tabs
      :tabs="allTabs"
      :value="value"
      :hiddenTabsLabel="$t('publish.ai_menu.select')"
      hiddenTabsIcon="sparkle"
      @input="$emit('input', $event)" />
  </div>
</template>

<script>
import Tabs from "@/components/molecules/Tabs.vue"

export default {
  name: "AIServiceMenu",
  components: {
    Tabs,
  },
  props: {
    services: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: "verbatim",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    allTabs() {
      // Mark AI service tabs as hidden (they go in submenu)
      // Keep verbatim as visible
      return this.tabs.map((tab) => ({
        ...tab,
        hidden: tab.name !== "verbatim" && tab.name !== "publication",
      }))
    },
  },
}
</script>

<style scoped>
.ai-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
}
</style>
