<template>
  <!-- What opens a multi-selection: the click on the whole field reaches the
       popover, the chips only remove. -->
  <div
    class="popover-list-trigger-multiple flex align-center"
    :class="{ 'popover-list-trigger-multiple--disabled': disabled }">
    <div
      class="popover-list-trigger-multiple__values flex1 flex align-center gap-tiny"
      @focusout="scrollValuesToStart">
      <span
        v-if="items.length === 0"
        class="popover-list-trigger-multiple__placeholder text-cut">
        {{ placeholder }}
      </span>
      <template v-for="item in items">
        <span
          v-if="item.exclusive"
          :key="item.id ?? item.value"
          class="popover-list-trigger-multiple__text text-cut">
          {{ item.name }}
        </span>
        <Chip
          v-else
          :key="item.id ?? item.value"
          class="popover-list-trigger-multiple__chip"
          soft
          removable
          :value="item.name"
          :title="item.name"
          :removeLabel="$t('popover_list.remove_item', { name: item.name })"
          :disabled="disabled"
          @remove="removeItem(item)" />
      </template>
    </div>
    <button
      ref="toggle"
      v-bind="ariaProps"
      class="popover-list-trigger-multiple__toggle custom flex align-center gap-small"
      type="button"
      :aria-label="label"
      :disabled="disabled"
      @click="closeIfOpen">
      <CountBadge
        v-if="items.length > 1"
        class="popover-list-trigger-multiple__count">
        {{ items.length }}
      </CountBadge>
      <PhIcon :name="open ? 'caret-up' : 'caret-down'" size="xs" />
    </button>
  </div>
</template>
<script>
import Chip from "./Chip.vue"
import CountBadge from "./CountBadge.vue"

export default {
  name: "PopoverListTriggerMultiple",
  components: { Chip, CountBadge },
  props: {
    // The selected items, see PopoverList
    items: { type: Array, required: true },
    // Shown when nothing is selected
    placeholder: { type: String, default: null },
    // Accessible name of the button
    label: { type: String, default: null },
    open: { type: Boolean, default: false },
    // What the button needs to be announced as opening the list
    ariaProps: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
  },
  methods: {
    // The focused button goes away with its chip.
    removeItem(item) {
      this.$emit("remove", item)
      this.$refs.toggle.focus()
    },
    // Reaching a cut chip by keyboard scrolls the row, which has no scrollbar.
    scrollValuesToStart(event) {
      event.currentTarget.scrollLeft = 0
    },
    // Not left to the popover, which only opens from here in a multi-selection.
    closeIfOpen(event) {
      if (!this.open) return
      event.stopPropagation()
      this.$emit("close")
    },
  },
}
</script>
<style lang="scss" scoped>
// Same height as the inputs of the forms.
.popover-list-trigger-multiple {
  box-sizing: border-box;
  width: 100%;
  height: 40.5px;
  overflow: hidden;
  border: var(--border-input);
  border-radius: var(--border-radius-sm);
  background: var(--background-primary);
  font-size: var(--text-sm);
  font-weight: normal;
  cursor: pointer;
}

.popover-list-trigger-multiple--disabled {
  background: var(--neutral-10);
  cursor: not-allowed;
}

// The fade tells there are more chips than what fits.
.popover-list-trigger-multiple__values {
  min-width: 0;
  padding: var(--tiny-gap) var(--small-gap);
  overflow: hidden;
  mask-image: linear-gradient(to left, transparent, black var(--large-gap));
}

.popover-list-trigger-multiple__chip {
  flex-shrink: 0;
  max-width: 11rem;
}

.popover-list-trigger-multiple__text {
  color: var(--text-primary);
  font-weight: 500;
}

.popover-list-trigger-multiple__placeholder {
  color: var(--text-secondary);
}

.popover-list-trigger-multiple__toggle {
  flex-shrink: 0;
  align-self: stretch;
  padding: 0 var(--small-gap);
  border: 0;
  border-left: var(--border-block);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
  color: var(--text-secondary);
  cursor: inherit;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--text-primary) 10%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
}

// The button has the background the badge has elsewhere.
.popover-list-trigger-multiple__toggle .popover-list-trigger-multiple__count {
  background: color-mix(in srgb, var(--text-primary) 10%, transparent);
}
</style>
