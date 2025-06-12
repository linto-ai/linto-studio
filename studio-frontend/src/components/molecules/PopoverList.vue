<template>
  <Popover :close-on-click-outside="closeOnClickOutside" :close-on-escape="closeOnEscape" :overlay="overlay">

    <template #trigger="{ open }">
      <slot name="trigger" :open="open">
        <Button v-bind="$attrs" :icon="open ? 'caret-up' : 'caret-down'" />
      </slot>
    </template>
    <template #content>
      <div class="popover-list__content">
        <div v-for="item in items" :key="item.id" class="popover-list__item">
          <Button
            :icon="item.icon"
            :icon-position="item.iconPosition"
            :icon-weight="item.iconWeight"
            :color="item.color"
            :icon-right="item.iconRight"
            @click="handleClickItem(item)"
            variant="outline"
            :size="size"
            >
            {{ item.name || item.text }}
          </Button>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script>
export default {
  name: "PopoverList",
  props: {
    /**
     * @type {Array<ListItem>}
     * @description List of items to display in the popover
     * @property {string} id - The id of the item
     * @property {string} name - The name of the item
     * @property {string} icon? - The icon of the item (optional)
     * @property {string} iconPosition? - The position of the icon (optional, default: "left")
     * @property {string} iconWeight? - The weight of the icon (optional, default: "regular")
     * @property {string} color? - The color of the item (optional, default: "primary")
     * @property {string} iconRight? - The right icon of the item (optional)
     */
    items: {
      type: Array,
      required: true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    closeOnEscape: {
      type: Boolean,
      default: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "sm",
    },
  },
  methods: {
    handleClickItem(item) {
      this.$emit("click", item)
    },
  },
}
</script>

<style lang="scss">
.popover-list__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
}

.popover-list__item {
  width: 100%;
  box-sizing: border-box;
  display: flex;

  .btn {
    width: 100%;
    justify-content: flex-start;
    border-radius: 0;
    text-align: left;
  }
}
</style>