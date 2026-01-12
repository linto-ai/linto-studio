<template>
  <div>
    <div
      class="flex row tabs"
      :class="{
        'horizontal-tabs': primary,
        'horizontal-tabs-secondary': secondary,
        'horizontal-tabs-inline': inline,
      }"
      role="tablist"
      :squareTabs="squareTabs">
      <div
        v-for="tab of visibleTabs"
        :key="tab.name"
        class="tab"
        role="tab"
        :title="tab.label"
        :aria-disabled="tab.disabled"
        :selected="value == tab.name"
        :aria-selected="value == tab.name"
        :id="tab.id ? tab.id : undefined"
        :aria-controls="tab.ariaControl ? tab.ariaControl : undefined"
        @click="!disabled && !tab.disabled && $emit('input', tab.name)">
        <ph-icon :name="tab.icon" :size="iconSize" v-if="tab.icon"></ph-icon>
        <img :src="tab.img" v-else-if="tab.img" class="icon" />
        <div class="flex col justify-center" :class="{ flex1: !squareTabs }">
          <span class="tab__label">{{ tab.label }}</span>
        </div>
        <Badge v-if="tab.badge" :inverted="value == tab.name">{{
          tab.badge
        }}</Badge>
      </div>

      <PopoverList
        v-if="hasHiddenTabs"
        :items="popoverItems"
        closeOnItemClick
        class="tabs__submenu"
        @click="handleHiddenTabSelect">
        <template #trigger="{ open }">
          <div
            class="tab tabs__submenu-trigger"
            :class="{ 'tabs__submenu-trigger--active': isHiddenTabSelected }"
            :selected="isHiddenTabSelected"
            role="tab"
            :aria-expanded="open"
            :aria-haspopup="true">
            <ph-icon
              :name="isHiddenTabSelected ? 'sparkle' : hiddenTabsIcon"
              :size="iconSize" />
            <span class="tab__label">{{ submenuButtonLabel }}</span>
            <ph-icon name="caret-down" size="sm" />
          </div>
        </template>
      </PopoverList>

      <div class="flex1 tab" v-if="secondary"></div>
    </div>
  </div>
</template>
<script>
import Badge from "@/components/atoms/Badge.vue"
import PopoverList from "@/components/atoms/PopoverList.vue"

export default {
  props: {
    tabs: { type: Array, required: true }, // array of tab objects { name: 'inbox', label: 'Inbox', icon: 'box', ?id, ?aria-control, ?hidden }
    value: { type: String, required: true }, // selected tab
    squareTabs: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    variant: { type: Boolean, default: "primary" }, // secondary, or inline
    // Label for the submenu trigger button when no hidden tab is selected
    hiddenTabsLabel: { type: String, default: "" },
    // Icon for the submenu trigger button
    hiddenTabsIcon: { type: String, default: "caret-down" },
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    secondary() {
      return this.variant === "secondary"
    },
    primary() {
      return this.variant === "primary"
    },
    inline() {
      return this.variant === "inline"
    },
    iconSize() {
      if (this.squareTabs) {
        return "lg"
      }

      if (this.secondary) {
        return "sm"
      }

      return "md"
    },
    visibleTabs() {
      return this.tabs.filter((tab) => !tab.hidden)
    },
    hiddenTabs() {
      return this.tabs.filter((tab) => tab.hidden)
    },
    hasHiddenTabs() {
      return this.hiddenTabs.length > 0
    },
    selectedHiddenTab() {
      return this.hiddenTabs.find((tab) => tab.name === this.value) || null
    },
    popoverItems() {
      return this.hiddenTabs.map((tab) => ({
        id: tab.name,
        value: tab.name,
        name: tab.label,
        text: tab.label,
        icon: this.value === tab.name ? "check" : tab.icon || "file-text",
        disabled: tab.disabled,
      }))
    },
    submenuButtonLabel() {
      if (this.selectedHiddenTab) {
        return this.selectedHiddenTab.label
      }
      return this.hiddenTabsLabel || this.$t("publish.ai_menu.select")
    },
    isHiddenTabSelected() {
      return this.selectedHiddenTab !== null
    },
  },
  methods: {
    handleHiddenTabSelect(item) {
      if (!this.disabled && !item.disabled) {
        this.$emit("input", item.value || item.id)
      }
    },
  },
  components: {
    Badge,
    PopoverList,
  },
}
</script>
