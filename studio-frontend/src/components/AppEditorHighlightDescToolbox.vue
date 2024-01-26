<template>
  <div class="conversation-highlight-toolbox">
    <h3 :class="[colorTextCategory]">{{ categoryName }}</h3>
    <p>Aucune meta-données</p>
  </div>
</template>
<script>
import CATEGORY_NAME_FROM_SCOPE from "../const/categoryNameFromScope"
import { bus } from "../main.js"

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
}
</script>
