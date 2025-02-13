<template>
  <div class="sidebar__section">
    <h3 class="flex align-center">
      <span class="flex1">Filtres</span>
      <button class="icon-only transparent">
        <span class="icon clear-history"></span>
      </button>
    </h3>
    <div>
      <Tag
        v-for="customfilter of customFilters"
        :key="customfilter._id"
        size="normal"
        :value="customfilter.value"
        :categoryName="customfilter.title"
        :removable="true"
        @remove="removeCustomFilter(customfilter)" />
    </div>

    <div class="flex wrap gap-small">
      <Tag
        v-for="tag of selectedTags"
        :key="tag._id"
        size="normal"
        :value="tag.name"
        :color="tag.color"
        :categoryId="tag.categoryId"
        :categoryName="tag.categoryName"
        :deletable="true"
        @delete="removeTag(tag)" />

      <button
        class="flex align-center only-border fullwidth"
        @click="addSearchCriterion">
        <span class="icon add"></span>
        <span class="flex1 left-text">Ajouter des tags</span>
      </button>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import Tag from "@/components/Tag.vue"

export default {
  props: {
    selectedTags: {
      type: Array,
      required: false,
      default: () => [],
    },
    customFilters: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    addSearchCriterion() {
      this.$emit("addSearchCriterion")
    },
    removeTag(tag) {
      const newValue = this.selectedTags.filter((t) => t._id != tag._id)
      this.$emit("onUpdateSelectedTags", newValue)
    },
  },
  components: {
    Tag,
  },
}
</script>
