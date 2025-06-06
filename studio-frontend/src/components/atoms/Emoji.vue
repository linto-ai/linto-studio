<template>
  <span class="emoji" :class="`size-${normalizedSize}`">
    {{ emoji }}
  </span>
</template>

<script>
export default {
  name: "Emoji",
  props: {
    unified: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
      validator: (value) =>
        [16, 24, 32, 48].includes(
          Number(value) || ["sm", "md", "lg", "xl"].includes(value),
        ),
    },
  },
  computed: {
    emoji() {
      return this.unifiedToEmoji(this.unified)
    },
    normalizedSize() {
      if (typeof this.size === "number") {
        return this.size
      }
      return {
        sm: 16,
        md: 24,
        lg: 32,
        xl: 48,
      }[this.size]
    },
  },
  methods: {
    unifiedToEmoji(unified) {
      return unified
        .split("-")
        .map((part) => String.fromCodePoint(parseInt(part, 16)))
        .join("")
    },
  },
}
</script>

<style lang="scss" scoped>
.emoji {
  font-size: var(--font-size-sm);

  &.size-16 {
    font-size: 16px;
  }

  &.size-24 {
    font-size: 24px;
  }

  &.size-32 {
    font-size: 32px;
  }

  &.size-48 {
    font-size: 48px;
  }
}
</style>
