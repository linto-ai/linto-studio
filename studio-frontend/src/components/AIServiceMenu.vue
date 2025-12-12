<template>
  <div class="ai-menu">
    <div class="ai-menu__tabs">
      <button
        type="button"
        class="ai-menu__tab"
        :class="{ active: value === 'verbatim' }"
        @click="selectService('verbatim')">
        <span class="ai-menu__tab-label">{{ $t('publish.tabs.verbatim') }}</span>
      </button>

      <div class="ai-menu__dropdown" v-click-outside="closeDropdown">
        <button
          type="button"
          class="ai-menu__tab ai-menu__tab--dropdown"
          :class="{ active: isAiServiceActive, open: isOpen }"
          @click="toggleDropdown">
          <span class="ai-menu__tab-label">{{ currentServiceLabel }}</span>
          <span class="ai-menu__tab-arrow" :class="{ open: isOpen }"></span>
        </button>

        <div v-if="isOpen" class="ai-menu__panel">
          <div class="ai-menu__panel-header">
            <span class="icon ai"></span>
            {{ $t('publish.ai_menu.title') }}
          </div>

          <div class="ai-menu__panel-body">
            <button
              v-for="service in aiServices"
              :key="service.name"
              type="button"
              class="ai-menu__item"
              :class="{ active: value === service.name }"
              :title="service.label"
              @click="selectService(service.name)">
              <span class="ai-menu__item-label">{{ service.label }}</span>
              <span v-if="value === service.name" class="icon done"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AIServiceMenu",
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
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    currentServiceLabel() {
      if (this.value === "verbatim") {
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
    isAiServiceActive() {
      // Active when not verbatim and not publication (i.e., an AI service is selected)
      return this.value !== "verbatim" && this.value !== "publication"
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
    },
    closeDropdown() {
      this.isOpen = false
    },
    selectService(serviceName) {
      this.$emit("input", serviceName)
      this.closeDropdown()
    },
  },
  directives: {
    "click-outside": {
      bind(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener("click", el._clickOutside)
      },
      unbind(el) {
        document.removeEventListener("click", el._clickOutside)
      },
    },
  },
}
</script>

<style scoped>
.ai-menu {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.ai-menu__tabs {
  display: inline-flex;
  align-items: center;
  background: var(--background-primary, white);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  padding: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.ai-menu__tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary, #666);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.ai-menu__tab:hover {
  color: var(--text-primary, #333);
  background: var(--background-secondary, #f5f5f5);
}

.ai-menu__tab.active {
  background: var(--primary-color);
  color: var(--primary-contrast);
}

.ai-menu__tab-label {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-menu__tab-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid currentColor;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.ai-menu__tab-arrow.open {
  transform: rotate(180deg);
}

/* Dropdown */
.ai-menu__dropdown {
  position: relative;
}

.ai-menu__panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 280px;
  max-width: 400px;
  background: var(--background-primary, white);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.15s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.ai-menu__panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: var(--primary-color);
  color: var(--primary-contrast);
  font-weight: 600;
  font-size: 0.875rem;
}

.ai-menu__panel-header .icon {
  width: 16px;
  height: 16px;
  background: white;
}

.ai-menu__panel-body {
  padding: 8px;
  max-height: 320px;
  overflow-y: auto;
}

.ai-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary, #333);
  font-size: 0.8125rem;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s ease;
}

.ai-menu__item:hover {
  background: var(--background-secondary, #f5f5f5);
}

.ai-menu__item.active {
  background: var(--primary-soft);
  color: var(--primary-color);
  font-weight: 500;
}

.ai-menu__item .icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.ai-menu__item.active .icon {
  background: var(--primary-color);
}

.ai-menu__item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scrollbar */
.ai-menu__panel-body::-webkit-scrollbar {
  width: 5px;
}

.ai-menu__panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.ai-menu__panel-body::-webkit-scrollbar-thumb {
  background: var(--border-color, #e0e0e0);
  border-radius: 3px;
}
</style>
