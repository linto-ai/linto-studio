<template>
  <div
    class="chip-tag"
    :class="[active ? 'active' : '', clickable, size]"
    :style="{ borderColor: borderColor, backgroundColor: backgroundColor }"
    @click="$emit('click')">
    <span class="chip-tag__data">
      <span v-if="emoji" class="chip-tag__icon-wrapper">
        <span
          class="chip-tag__icon-emoji"
          :style="{ borderColor: borderColor }">
          {{ unifiedToEmoji(emoji) }}
        </span>
      </span>
      <span class="chip-tag__name" :style="{ color: colorText }">
        {{ name }}
      </span>
      <ph-icon v-if="active" name="trash" :color="colorText" />
      <Avatar
        v-if="count"
        class="chip-tag__count"
        size="xs"
        color="var(--primary-soft)"
        :color-text="color">
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
      default: "var(--material-teal-500)",
    },
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
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
      return `var(--material-${this.color}-${this.active ? 500 : 100})`
    },
    colorText() {
      const LOW_CONTRAST_COLORS = ["yellow"]
      console.log(
        "[ChipTag] colorText",
        this.color,
        this.active,
        LOW_CONTRAST_COLORS.includes(this.color),
      )
      if (this.active && !LOW_CONTRAST_COLORS.includes(this.color)) {
        return "var(--primary-soft)"
      }
      return "var(--text-color)"
    },
  },
  methods: {
    unifiedToEmoji(unified) {
      if (!unified) return ""
      return unified
        .split("-")
        .map((u) => String.fromCodePoint(parseInt(u, 16)))
        .join("")
    },
  },
}
</script>

<style lang="scss" scoped>
.chip-tag {
  display: inline-flex;
  flex-direction: column;
  padding: 0.1em 0.45em 0.1em 0.45em;
  margin: 0.1em;
  border-radius: 4px;
  border: 1px solid var(--primary-soft);
  background: var(--background-primary);
  font-size: 0.9em;
  font-weight: 600;
  transition:
    border-color 0.2s,
    background 0.2s;

  &.sm {
    font-size: 0.9em;
  }
  &.lg {
    font-size: 1.1em;
  }
  &.md {
    font-size: 1em;
  }

  &.clickable {
    cursor: pointer;
  }

  &:hover {
    background: var(--neutral-20);
  }

  .chip-tag__data {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
  }

  .chip-tag__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }
  .chip-tag__icon-emoji {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 2px;
    font-size: 1em;
    color: #222;
  }
  .chip-tag__icon-color {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    background: var(--neutral-40);
    display: inline-block;
  }
  .chip-tag__name {
    display: inline-block;
    font-size: 1em;
    font-weight: 500;
    padding: 0 0.5em;
    max-width: 21ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .chip-tag__count {
    font-size: 0.9em;
    font-weight: 600;
    opacity: 0.95;
    margin-left: 0.25em;
  }
  .chip-tag__description {
    font-size: 0.8em;
    color: var(--neutral-10);
  }
  &.active {
    .chip-tag__name {
      font-weight: 600;
    }
  }
}
</style>
