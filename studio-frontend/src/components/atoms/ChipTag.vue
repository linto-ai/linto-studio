<template>
  <div
    class="chip-tag"
    :class="[active ? 'active' : '', clickable, size]"
    :style="{ borderColor: borderColor, backgroundColor: backgroundColor }"
    @click="$emit('click')"
  >
    <span v-if="emoji" class="chip-tag__icon-wrapper">
      <span
        class="chip-tag__icon-emoji"
        :style="{ backgroundColor: borderColor }"
      >
        {{ unifiedToEmoji(emoji) }}
      </span>
    </span>
    <span class="chip-tag__name">
      {{ name }}
    </span>
    <slot></slot>
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
      default: '',
    },
    color: {
      type: String,
      default: 'var(--neutral-40)',
    },
    background: {
      type: String,
      default: 'var(--background-primary)',
    },
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
  },
  computed: {
    clickable() {
      return this.$listeners.click ? 'clickable' : ''
    },
    borderColor() {
      return this.active ? this.color : this.background
    },
    backgroundColor() {
      return this.active ? this.background : this.color
    },
  },
  methods: {
    unifiedToEmoji(unified) {
      if (!unified) return ''
      return unified
        .split('-')
        .map(u => String.fromCodePoint(parseInt(u, 16)))
        .join('');
    },
  },
}
</script>

<style lang="scss" scoped>
.chip-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.1em;
  padding: 0.1em 0.25em 0.1em 0.25em;
  margin: 0.1em;
  border-radius: 2px;
  border: 1px transparent var(--neutral-40);
  background: var(--background-primary);
  font-size: 0.9em;
  font-weight: 600;
  transition: border-color 0.2s, background 0.2s;

  &.active {
    .chip-tag__name {
      color: var(--neutral-20);
    }
  }

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
    background: var(--neutral-40);
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
    font-size: 0.9em;
    font-weight: 600;
    color: var(--neutral-10);
    opacity: 0.95;
    padding: 0 0.1em;
    border-radius: 2px;
    max-width: 21ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: uppercase;
  }
}
</style> 