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
  <div class="tooltip-container">
    <slot ref="trigger"></slot>
    <div
      v-if="text && text.trim()"
      class="tooltip-content"
      :class="[position]"
      :style="{ borderColor: borderColor }">
      <span
        class="tooltip-content__inner"
        :style="{ backgroundColor: backgroundColor, color: color }">
        <Emoji v-if="emoji" :unified="emoji" size="16" />
        <ph-icon v-if="icon" :name="icon" size="sm" />
        <span class="tooltip-content__text">
          {{ text }}
        </span>
      </span>
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
      default: "var(text-color)",
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
  mounted() {},
}
</script>

<style lang="scss" scoped>
.tooltip-container {
  position: relative;

  &:hover {
    .tooltip-content {
      display: block;
    }
  }
}

.tooltip-content {
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
  padding: 1px;
  display: none;
  position: absolute;

  z-index: 50;
  border: 1px solid;
}

.tooltip-content.bottom {
  top: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content.top {
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content.left {
  right: calc(100% + 2px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-content.right {
  left: calc(100% + 2px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-content__inner {
  display: flex;
  border-radius: 1px;
  font-size: 0.875rem;
  line-height: 1.4;
  padding: 0.5em 0.75em;
  align-items: center;
  gap: 0.5em;
  color: var(--neutral-100);
}
</style>
