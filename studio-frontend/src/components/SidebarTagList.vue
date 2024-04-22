<template>
  <section class="organization-sidebar__current-filter sidebar__section">
    <h2 class="flex row">
      <span class="flex1">{{ $t("conversation.search_criterions") }}</span>
      <!-- <button class="transparent" @click="resetFilters" v-if="hasFilters">
        <span class="icon trash"></span>
      </button> -->
      <!--<span class="icon options" @click="openExploreModal"></span>-->
    </h2>

    <div class="flex col gap-medium">
      <ul
        v-if="
          (selectedTags && selectedTags.length > 0) ||
          (customFilters && Object.keys(customFilters).length > 0)
        "
        class="organization-sidebar__tag-list">
        <li
          v-for="customfilter of customFilters"
          class="flex"
          :key="customfilter._id">
          <Tag
            size="normal"
            :value="customfilter.value"
            :categoryName="customfilter.title"
            :removable="true"
            @remove="removeCustomFilter(customfilter)" />
        </li>
        <li
          v-for="tag of selectedTags"
          :key="tag._id"
          class="flex organization-sidebar__tag-list">
          <Tag
            size="normal"
            :value="tag.name"
            :color="tag.color"
            :categoryId="tag.categoryId"
            :categoryName="tag.categoryName"
            :removable="true"
            @remove="removeTag(tag)" />
        </li>
      </ul>
      <div class="flex col gap-small" v-else>
        <div>{{ $t("conversation.no_search_criterion") }}</div>
      </div>
      <button class="btn green wrap" style="width: 100%">
        <span class="icon add"></span>
        <span class="label" @click="addSearchCriterion">{{
          $t("conversation.add_search_criterion")
        }}</span>
      </button>
      <button class="btn red wrap" style="width: 100%" :disabled="!hasFilters">
        <span class="icon trash"></span>
        <span class="label" @click="resetFilters">{{
          $t("conversation.remove_all_filters")
        }}</span>
      </button>
    </div>
  </section>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
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
  computed: {
    hasFilters() {
      return (
        this.selectedTags.length > 0 ||
        Object.keys(this.customFilters).length > 0
      )
    },
  },
  methods: {
    removeCustomFilter(filter) {
      const newValue = Object.assign({}, this.customFilters)
      delete newValue[filter.key]
      this.$emit("onUpdateCustomFilters", newValue)
    },
    removeTag(tag) {
      const newValue = this.selectedTags.filter((t) => t._id != tag._id)
      this.$emit("onUpdateSelectedTags", newValue)
    },
    addSearchCriterion() {
      this.$emit("addSearchCriterion")
    },
    resetFilters() {
      this.$emit("onUpdateSelectedTags", [])
      this.$emit("onUpdateCustomFilters", {})
    },
  },
  components: { Fragment, Tag },
}
</script>
