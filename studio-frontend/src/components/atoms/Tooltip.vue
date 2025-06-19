<template>
  <Popover
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
      <div
        v-if="text && text.trim()"
        class="tooltip-content"
        :style="{ backgroundColor: borderColor }"
      >
        <span
          class="tooltip-content__inner"
          :style="{ backgroundColor: backgroundColor }"
        >
          <Emoji v-if="emoji" :unified="emoji" size="16" />
          <ph-icon v-if="icon" :name="icon" size="sm" />
          <span class="tooltip-content__text">
            {{ text }}
          </span>
        </span>
      </div>
    </template>
  </Popover>
</template>

<script>
import Popover from "@/components/atoms/Popover.vue";
import PhIcon from "./PhIcon.vue";

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
};
</script>

<style lang="scss" scoped>
// This makes the popover container transparent to let the tooltip style shine.
::v-deep .tooltip-popover-container {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  min-width: unset !important;
  border-radius: 0 !important;
  // Add a small offset, same as the original component had
  &.top { margin-top: -8px; }
  &.bottom { margin-top: 8px; }
  &.left { margin-left: -8px; }
  &.right { margin-left: 8px; }
}

.tooltip-trigger {
  &.inline {
    display: inline-flex;
    align-items: center;
  }
  &.block {
    display: block;
  }
}

.tooltip-content {
  border-radius: 2px;
  white-space: nowrap;
  pointer-events: none;
  padding: 1px;
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
