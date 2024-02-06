<template>
  <ContextMenu
    name="highlight-toolbox"
    first
    class="conversation-highlight-toolbox">
    <div class="context-menu__element">
      <h3 :class="[colorTextCategory]">{{ categoryName }}</h3>
      <p class="conversation-highlight-toolbox__content">{{ tag.name }}</p>
    </div>
  </ContextMenu>
</template>
<script>
import CATEGORY_NAME_FROM_SCOPE from "../const/categoryNameFromScope"
import { bus } from "../main.js"

import ContextMenu from "./ContextMenu.vue"

export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
    tag: {
      type: Object,
      required: true,
    },
  },
  computed: {
    colorTextCategory() {
      return `color-${this.category.color}-900`
    },
    categoryName() {
      return (
        CATEGORY_NAME_FROM_SCOPE((key) => this.$t(key))[this.category.scope] ??
        this.category.name
      )
    },
  },
  methods: {},
  components: { ContextMenu },
}
</script>
