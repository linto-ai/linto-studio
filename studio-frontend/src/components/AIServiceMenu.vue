<template>
  <div class="ai-menu">
    <Tabs
      :tabs="allTabs"
      :value="value"
      variant="secondary"
      :hiddenTabsLabel="$t('publish.ai_menu.more')"
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
    maxVisibleServices: {
      type: Number,
      default: 3,
    },
  },
  computed: {
    allTabs() {
      // Verbatim is always visible
      // Show first N AI service tabs as visible, rest go in submenu
      let serviceIndex = 0
      return this.tabs.map((tab) => {
        if (tab.name === "verbatim") {
          return { ...tab, hidden: false }
        }
        serviceIndex++
        return {
          ...tab,
          hidden: serviceIndex > this.maxVisibleServices,
        }
      })
    },
    hasOverflow() {
      const serviceCount = this.tabs.filter((t) => t.name !== "verbatim").length
      return serviceCount > this.maxVisibleServices
    },
  },
}
</script>

<style scoped>
.ai-menu {
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
