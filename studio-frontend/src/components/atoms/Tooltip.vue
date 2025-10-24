<template>
  <!-- <Popover
    :position="position"
    content-class="tooltip-popover-container"
    trigger="hover"
    close-on-click
  >
    <template #trigger>
      <span :class="['tooltip-trigger', mode]">
        <slot></slot>
      </span>
    </template>
    <template #content>
      
    </template>
  </Popover> -->
  <div
    class="tooltip-container"
    ref="container"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave">
    <slot ref="trigger"></slot>
    <!-- v-show instead of v-if so element exist in the dom -->
    <div
      v-if="(text && text.trim()) || $slots.content"
      v-show="isVisible"
      ref="tooltip"
      class="tooltip-content"
      :class="tooltipClasses"
      :style="{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        maxWidth: typeof maxWidth === 'number' ? maxWidth + 'px' : maxWidth,
        ...tooltipPosition,
      }">
      <slot name="content">
        <span class="tooltip-content__inner" :style="{ color: color }">
          <Emoji v-if="emoji" :unified="emoji" size="16" />
          <ph-icon v-if="icon" :name="icon" size="sm" />
          <span class="tooltip-content__text">
            {{ text }}
          </span>
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import Popover from "@/components/atoms/Popover.vue"
import PhIcon from "./PhIcon.vue"

export default {
  name: "Tooltip",
  components: {
    Popover,
    PhIcon,
  },
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
    color: {
      type: String,
      default: "var(--primary-hard)",
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
    maxWidth: {
      type: [Number, String],
      default: 300,
    },
    delay: {
      type: [Number],
      default: 300,
    },
  },
  data() {
    return {
      tooltipPosition: {},
      isVisible: false,
      positionIsCompute: false,
      actualPosition: "top",
      debounceTimeout: null,
      finallyVisible: false,
    }
  },
  mounted() {
    this.updateTooltipPosition()
    window.addEventListener("resize", this.updateTooltipPosition)
    window.addEventListener("scroll", this.updateTooltipPosition, true)
  },
  computed: {
    tooltipClasses() {
      const res = []
      res.push(this.actualPosition)
      if (this.finallyVisible) {
        res.push("finally-visible")
      }
      return res
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateTooltipPosition)
    window.removeEventListener("scroll", this.updateTooltipPosition, true)
  },
  methods: {
    async updateTooltipPosition() {
      await this.$nextTick()

      if (!this.$refs.container || !this.$refs.tooltip) return

      const containerRect = this.$refs.container.getBoundingClientRect()
      const tooltipElement = this.$refs.tooltip
      const tooltipRect = this.$refs.tooltip.getBoundingClientRect()

      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      const offset = 8
      const margin = 16 // Marge minimale par rapport aux bords du viewport

      // Ordre de priorité des positions selon la position demandée
      const positionPriority = {
        top: ["top", "bottom", "right", "left"],
        bottom: ["bottom", "top", "right", "left"],
        left: ["left", "right", "top", "bottom"],
        right: ["right", "left", "top", "bottom"],
      }

      const positions = positionPriority[this.position] || [
        "top",
        "bottom",
        "left",
        "right",
      ]

      // Tester chaque position pour trouver la meilleure
      for (const pos of positions) {
        const candidatePosition = this.calculatePosition(
          containerRect,
          tooltipRect,
          pos,
          offset,
        )

        if (
          this.isPositionValid(candidatePosition, tooltipRect, viewport, margin)
        ) {
          this.actualPosition = pos
          this.tooltipPosition = candidatePosition
          return
        }
      }
      // Si aucune position idéale n'est trouvée, utiliser la position demandée avec ajustements
      const fallbackPosition = this.calculatePosition(
        containerRect,
        tooltipRect,
        this.position,
        offset,
      )
      this.actualPosition = this.position
      this.tooltipPosition = this.adjustPositionToViewport(
        fallbackPosition,
        tooltipRect,
        viewport,
        margin,
      )

      this.positionIsCompute = true
    },

    calculatePosition(containerRect, tooltipRect, position, offset) {
      const positions = {
        bottom: {
          top: `${containerRect.bottom + offset}px`,
          left: `${containerRect.left + containerRect.width / 2}px`,
          transform: "translateX(-50%)",
        },
        top: {
          top: `${containerRect.top - offset}px`,
          left: `${containerRect.left + containerRect.width / 2}px`,
          transform: "translate(-50%, -100%)",
        },
        left: {
          top: `${containerRect.top + containerRect.height / 2}px`,
          left: `${containerRect.left - offset}px`,
          transform: "translate(-100%, -50%)",
        },
        right: {
          top: `${containerRect.top + containerRect.height / 2}px`,
          left: `${containerRect.right + offset}px`,
          transform: "translateY(-50%)",
        },
      }

      return positions[position]
    },

    isPositionValid(position, tooltipRect, viewport, margin) {
      const { finalTop, finalLeft, finalWidth, finalHeight } =
        this.getFinalCoords(position, tooltipRect)

      return (
        finalTop >= margin &&
        finalLeft >= margin &&
        finalTop + finalHeight <= viewport.height - margin &&
        finalLeft + finalWidth <= viewport.width - margin
      )
    },

    adjustPositionToViewport(position, tooltipRect, viewport, margin) {
      const adjustedPosition = { ...position }

      const { finalTop, finalLeft, finalWidth, finalHeight } =
        this.getFinalCoords(position, tooltipRect)

      let newLeft = finalLeft
      let newTop = finalTop
      let transform = position.transform

      // Ajuster horizontalement
      if (finalLeft < margin) {
        newLeft = margin
        transform = "none"
      } else if (finalLeft + finalWidth > viewport.width - margin) {
        newLeft = viewport.width - margin - finalWidth
        transform = "none"
      }

      // Ajuster verticalement
      if (finalTop < margin) {
        newTop = margin
        transform = "none"
      } else if (finalTop + finalHeight > viewport.height - margin) {
        newTop = viewport.height - margin - finalHeight
        transform = "none"
      }

      adjustedPosition.left = `${newLeft}px`
      adjustedPosition.top = `${newTop}px`
      adjustedPosition.transform = transform

      return adjustedPosition
    },

    getFinalCoords(position, tooltipRect) {
      const top = parseFloat(position.top)
      const left = parseFloat(position.left)

      const finalWidth = tooltipRect.width || 200
      const finalHeight = tooltipRect.height || 40

      let finalTop = top
      let finalLeft = left

      // Appliquer les transformations
      if (position.transform.includes("translateX(-50%)")) {
        finalLeft = left - finalWidth / 2
      } else if (position.transform.includes("translate(-100%")) {
        finalLeft = left - finalWidth
      }

      if (position.transform.includes("translateY(-50%)")) {
        finalTop = top - finalHeight / 2
      } else if (position.transform.includes("translate(-50%, -100%)")) {
        finalTop = top - finalHeight
        finalLeft = left - finalWidth / 2
      }

      return { finalTop, finalLeft, finalWidth, finalHeight }
    },
    onMouseEnter() {
      this.debounceTimeout = setTimeout(async () => {
        this.isVisible = true
        await this.updateTooltipPosition()
        this.finallyVisible = true
      }, this.delay)
    },
    onMouseLeave() {
      clearTimeout(this.debounceTimeout)
      this.isVisible = false
      this.finallyVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
.tooltip-container {
  position: relative;
  display: flex;
  cursor: help;
}

.tooltip-content {
  border-radius: 6px;
  pointer-events: none;
  padding: 1px;
  display: block;
  position: fixed;
  z-index: 9999;
  border: 1px solid;
  min-width: 80px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s;

  &.finally-visible {
    opacity: 1;
    visibility: visible;
  }
}

/* Position is now handled by JavaScript */

.tooltip-content__inner {
  display: flex;
  border-radius: 5px;
  font-size: 0.875rem;
  line-height: 1.4;
  padding: 0.5em 0.75em;
  align-items: center;
  gap: 0.5em;
  color: var(--neutral-100);
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

.tooltip-content__text {
  white-space: pre-wrap;
  text-align: center;
}
</style>
