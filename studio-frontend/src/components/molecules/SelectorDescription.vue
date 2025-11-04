<template>
  <Popover
    close-on-click-outside
    close-on-escape
    overlay
    v-if="!readonly"
    ref="popover">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button
          :iconRight="open ? 'caret-up' : 'caret-down'"
          :label="currentItem.name" />
      </slot>
    </template>
    <template #content>
      <SelectorDescriptionContent
        v-model="_value"
        :readonly="readonly"
        :items="items" />
    </template>
  </Popover>
  <Tooltip v-else maxWidth="400px" position="bottom">
    <div class="role-selector-container--readonly">
      {{ currentItem.name }}
    </div>
    <template #content>
      <SelectorDescriptionContent
        v-model="_value"
        :readonly="readonly"
        :items="items" />
    </template>
  </Tooltip>
</template>

<script>
import SelectorDescriptionContent from "./SelectorDescriptionContent.vue"
import Tooltip from "../atoms/Tooltip.vue"
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // {name, value, description}
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue", "updateUserRole"],
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
        this.$refs.popover && this.$refs.popover.close()
      },
    },
    currentItem() {
      return this.items.find((ur) => ur.value === this.value)
    },
  },
  components: {
    SelectorDescriptionContent,
  },
}
</script>

<style lang="css">
.role_name {
  font-weight: 500;
}

.role_description {
  color: var(--text-secondary);
  font-size: 0.9em;
}

.role-selector-container--readonly {
  position: relative;

  .role-selector {
    display: none;
    position: absolute;
    background-color: white;
    border: 1px solid;
  }

  &:hover {
    .role-selector {
      display: grid;
    }
  }
}
</style>
