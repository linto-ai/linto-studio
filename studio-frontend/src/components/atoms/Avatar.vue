<template>
  <div
    class="avatar"
    :class="[size, color, clickable]"
    :style="{ backgroundColor: color }"
    @click="$emit('click')">
    <img v-if="src" :src="src" :alt="text" />
    <ph-icon
      v-else-if="icon"
      :name="icon"
      class="avatar"
      :size="size"
      :color="colorIcon" />
    <span v-else-if="text" class="avatar-text" :class="[colorText]" :style="{ color: colorText }">{{
      text
    }}</span>
    <slot></slot>
  </div>
</template>

<script>
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
    color: {
      type: String,
      required: false,
      default: "primary", // primary, secondary, tertiary… or any hex color
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
      type: String,
      required: false,
      default: "sm", // xs, sm, md, lg, xl
    },
  },
  computed: {
    clickable() {
      return this.$listeners.click ? "clickable" : ""
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
