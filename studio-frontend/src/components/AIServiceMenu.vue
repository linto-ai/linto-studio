<template>
  <div class="ai-menu">
    <Tabs
      :tabs="mainTabs"
      :value="activeTabValue"
      secondary
      @input="handleTabChange" />

    <PopoverList
      v-if="aiServices.length > 0"
      :items="popoverItems"
      closeOnItemClick
      class="ai-menu__popover"
      @click="handleServiceSelect">
      <template #trigger="{ open }">
        <Button
          :icon="isAiServiceActive ? 'sparkle' : 'caret-down'"
          :iconRight="isAiServiceActive ? 'caret-down' : undefined"
          :variant="isAiServiceActive ? 'primary' : 'tertiary'"
          size="sm"
          :label="currentServiceLabel" />
      </template>
    </PopoverList>
  </div>
</template>

<script>
import Tabs from "@/components/molecules/Tabs.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  name: "AIServiceMenu",
  components: {
    Tabs,
    PopoverList,
    Button,
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
    mainTabs() {
      // Only show verbatim as a direct tab
      return [
        { name: "verbatim", label: this.$t("publish.tabs.verbatim"), icon: "file-text" },
      ]
    },
    activeTabValue() {
      // If verbatim is selected, return it; otherwise return empty to not highlight verbatim
      return this.value === "verbatim" ? "verbatim" : ""
    },
    currentServiceLabel() {
      if (!this.isAiServiceActive) {
        return this.$t("publish.ai_menu.select")
      }
      const service = this.tabs.find(t => t.name === this.value)
      if (service) {
        return service.label
      }
      return this.$t("publish.ai_menu.select")
    },
    aiServices() {
      // Filter out verbatim and publication - they are handled separately
      return this.tabs.filter(tab => tab.name !== "verbatim" && tab.name !== "publication")
    },
    popoverItems() {
      return this.aiServices.map(service => ({
        id: service.name,
        value: service.name,
        text: service.label,
        name: service.label,
        icon: this.value === service.name ? "check" : "sparkle",
      }))
    },
    isAiServiceActive() {
      // Active when not verbatim and not publication (i.e., an AI service is selected)
      return this.value !== "verbatim" && this.value !== "publication"
    },
  },
  methods: {
    handleTabChange(tabName) {
      if (tabName) {
        this.$emit("input", tabName)
      }
    },
    handleServiceSelect(item) {
      this.$emit("input", item.value || item.id)
    },
  },
}
</script>

<style scoped>
.ai-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.ai-menu__popover {
  margin-left: 0.25rem;
}
</style>
