<template>
  <div
    class="chip-tag"
    :class="[active ? 'active' : '', clickable, size]"
    :style="{
      borderColor: borderColor,
      backgroundColor: backgroundColor,
      color: colorText,
    }"
    @click="$emit('click')">
    <span class="chip-tag__data">
      <span v-if="emoji" class="chip-tag__icon-wrapper">
        <span
          class="chip-tag__icon-emoji"
          :style="{ borderColor: borderColor }">
          {{ unifiedToEmoji(emoji) }}
        </span>
      </span>
      <span
        class="chip-tag__name"
        :class="{ 'with-emoji': emoji }"
        :style="{ color: colorText }">
        {{ name }}
      </span>
      <ph-icon v-if="active" name="trash" color="var(--neutral-10)" />
      <Avatar
        v-if="count"
        class="chip-tag__count"
        size="xs"
        color="var(--neutral-20)"
        color-text="var(--neutral-10)">
        {{ count }}
      </Avatar>
      <slot></slot>
    </span>
    <span v-if="description" class="chip-tag__description">
      {{ description }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ChipTag",
  props: {
    name: {
      type: String,
      required: true,
    },
    emoji: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "teal",
    },
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: [Number, String],
      default: "md",
    },
    count: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  computed: {
    clickable() {
      return this.$listeners.click ? "clickable" : ""
    },
    borderColor() {
      return `var(--material-${this.color}-500)`
    },
    backgroundColor() {
      return `var(--material-${this.color}-${this.active ? 800 : 100})`
    },
    colorText() {
      return this.active ? "white" : `var(--material-${this.color}-900)`
    },
  },
  methods: {
    unifiedToEmoji(unified) {
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
  },
}
</script>

<style lang="scss" scoped>
.chip-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding-left: 0.5em;
  padding-right: 0.5em;

  text-transform: capitalize;
  border: 1px solid;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  text-overflow: ellipsis;

  white-space: nowrap;
  // box-shadow:
  //   inset 0 0 0 1px rgba(255, 255, 255, 0.4),
  //   inset 0px 0.2px 0 1px rgba(255, 255, 255, 0.4);
  &.active {
    .chip-tag__count {
      display: none;
    }
  }

  &:has(.chip-tag__count) {
    padding-right: 0.25em;
  }

  &:hover {
    border-color: currentColor !important;
  }
  .chip-tag__data {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    //line-height: 1em;
  }

  .chip-tag__name {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chip-tag__count {
    border-radius: 4px;
  }

  &.clickable {
    cursor: pointer;
  }
}
</style>
