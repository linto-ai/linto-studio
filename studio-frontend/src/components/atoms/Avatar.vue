<template>
  <div
    class="avatar"
    :class="[size, color, clickable, circle ? 'circle' : '']"
    :style="{
      backgroundColor: computedColor,
      width: computedSize,
      height: computedSize,
    }"
    @click="$emit('click')">
    <img
      v-if="src"
      :src="src"
      :alt="text"
      @error="onImgError"
      ref="avatar-img" />
    <ph-icon
      v-else-if="icon"
      :name="icon"
      class="avatar"
      :size="size"
      :color="colorIcon" />
    <span
      v-else-if="text"
      class="avatar-text"
      :class="[colorText]"
      :style="{ color: colorText }"
      >{{ text }}</span
    >
    <span
      v-else-if="emoji"
      class="avatar-emoji"
      :class="[colorText]"
      :style="{ color: colorText }"
      >{{ unifiedToEmoji }}</span
    >
    <slot></slot>
  </div>
</template>

<script>
import { getEnv } from "@/tools/getEnv"
import userAvatar from "@/tools/userAvatar"

export default {
  name: "Avatar",
  props: {
    src: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
      default: "",
    },
    emoji: {
      type: String,
      required: false,
    },
    circle: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: "primary", // primary, secondary, tertiary… or any hex color
    },
    materialColor: {
      type: String,
      required: false,
    },
    colorIcon: {
      type: String,
      required: false,
      default: "primary-soft", // primary, secondary, tertiary…
    },
    colorText: {
      type: String,
      required: false,
      default: "primary-soft", // primary, secondary, tertiary…
    },
    icon: {
      type: String,
      required: false,
      default: "",
    },
    size: {
      type: [Number, String],
      required: false,
      default: "sm", // xs, sm, md, lg, xl
    },
  },
  data() {
    return {
      onError: false,
    }
  },
  computed: {
    clickable() {
      return this.$attrs.onClick ? "clickable" : ""
    },
    unifiedToEmoji() {
      const unified = this.emoji
      if (!unified) return ""

      try {
        return unified
          .split("-")
          .map((u) => String.fromCodePoint(parseInt(u, 16)))
          .join("")
      } catch (e) {
        return unified
      }
    },
    computedColor() {
      if (this.materialColor) {
        return `var(--material-${this.materialColor}-${this.active ? 500 : 100})`
      }
      return this.color
    },
    computedSize() {
      if (typeof this.size === "number") {
        return this.size + "px"
      }
      return this.size
    },
  },
  methods: {
    onImgError() {
      if (this.onError) return
      this.onError = true
      const path = userAvatar("/pictures/default.jpg")
      this.$refs["avatar-img"].src = path
    },
  },
}
</script>

<style lang="scss">
a:hover .avatar {
  /* hack to make the avatar clickable without ugly underline */
  text-decoration: underline overline;
  text-decoration-color: var(--primary-color);
}

.avatar {
  position: relative;
  padding: 0;
  margin: 0;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.circle {
    border-radius: 50%;
  }

  &.clickable {
    cursor: pointer;
  }

  &.xs {
    width: 16px;
    height: 16px;
  }

  &.sm {
    width: 24px;
    height: 24px;
  }

  &.md {
    width: 32px;
    height: 32px;
  }

  &.lg {
    width: 40px;
    height: 40px;
  }

  &.xl {
    width: 48px;
    height: 48px;
  }

  &.primary {
    background-color: var(--primary-color);
    color: var(--primary-soft);
  }

  &.secondary {
    background-color: var(--secondary-color);
    color: var(--secondary-soft);
  }

  &.tertiary {
    background-color: var(--tertiary-color);
    color: var(--tertiary-soft);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-text {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>
