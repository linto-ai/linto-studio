<template>
  <span
    class="tooltip-trigger"
    @mouseenter="show"
    @mouseleave="hide"
    ref="trigger"
    :class="mode">
    <slot></slot>
    <portal to="body" v-if="isOpen">
      <div
        class="tooltip-content"
        :class="position"
        ref="content"
        :style="tooltipStyle">
        <span class="tooltip-content__inner" :style="{ backgroundColor: backgroundColor }">
          <Emoji v-if="emoji" :unified="emoji" size="16" />
          <ph-icon v-if="icon" :name="icon" size="16" />
          <span class="tooltip-content__text">
            {{ text }}
          </span>
        </span>
      </div>
    </portal>
  </span>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: null,
    },
    emoji: {
      type: String,
      default: null,
    },
    mode: {
      type: String,
      default: "inline",
      validator: (value) => ["block", "inline"].includes(value),
    },
    borderColor: {
      type: String,
      default: "var(--primary-hard)",
    },
    backgroundColor: {
      type: String,
      default: "var(--neutral-10)",
    },
    position: {
      type: String,
      default: "top",
      validator: (value) => ["top", "bottom", "left", "right"].includes(value),
    },
  },
  data() {
    return {
      isOpen: false,
      tooltipCoords: { top: 0, left: 0 },
    }
  },
  computed: {
    tooltipStyle() {
      return {
        position: "fixed",
        left: `${this.tooltipCoords.left}px`,
        top: `${this.tooltipCoords.top}px`,
        zIndex: 9999,
        backgroundColor: this.borderColor,
      }
    },
  },
  methods: {
    show() {
      if (!this.text || !this.text.trim()) return
      this.isOpen = true
      this.$nextTick(() => {
        this.updatePosition()
        window.addEventListener("scroll", this.updatePosition, true)
        window.addEventListener("resize", this.updatePosition, {
          passive: true,
        })
      })
    },
    hide() {
      this.isOpen = false
      window.removeEventListener("scroll", this.updatePosition, true)
      window.removeEventListener("resize", this.updatePosition)
    },
    updatePosition() {
      const trigger = this.$refs.trigger
      const content = this.$refs.content
      if (!trigger || !content) return

      const rect = trigger.getBoundingClientRect()
      const tooltipRect = content.getBoundingClientRect()
      const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window
      const offset = 8

      let top = 0
      let left = 0

      switch (this.position) {
        case "top":
          top = rect.top - tooltipRect.height - offset
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case "bottom":
          top = rect.bottom + offset
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case "left":
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.left - tooltipRect.width - offset
          break
        case "right":
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.right + offset
          break
      }

      const margin = 8
      left = Math.max(
        margin,
        Math.min(left, viewportWidth - tooltipRect.width - margin),
      )
      top = Math.max(
        margin,
        Math.min(top, viewportHeight - tooltipRect.height - margin),
      )

      this.tooltipCoords = { top: Math.round(top), left: Math.round(left) }
    },
  },
  beforeDestroy() {
    this.hide()
  },
}
</script>

<style lang="scss" scoped>
.tooltip-trigger {
  display: inline-block;
  position: relative;

  &.inline {
    display: inline-flex;
  }

  &.block {
    display: inline-block;
  }
}

.tooltip-content {
  position: absolute;
  background-color: var(--primary-hard);
  color: var(--neutral-10);
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none; /* Tooltip should not be interactive */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &__inner {
    margin: 2px;
    display: flex;
    border-radius: 1px;
    font-size: 0.875rem;
    line-height: 1.4;
    padding: 0.5em 0.75em;
    align-items: center;
    gap: 0.5em;
    background-color: var(--neutral-10);
    color: var(--neutral-100);
  }
}
</style>
