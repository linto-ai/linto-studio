<template>
  <div>
    <!-- <h3 class="dropdown-header flex row gap-small small-padding align-center">
      <button class="inline transparent" @click="backToTagSearch">
        <span class="icon left-arrow"></span>
        <span class="label">{{ $t("tags.back_to_search") }}</span>
      </button>
    </h3> -->

    <div class="flex1 small-padding flex row align-bottom">
      <label class="flex flex1 no-margin">
        <Tag
          :value="tagValue"
          :categoryName="currentTagcategoryName"
          :color="currentTagcategoryColor" />
      </label>
      <button @click="done" :disabled="selectedCategory == null" class="green">
        <ph-icon name="check" size="md" />
        <span class="label">{{ $t("tags.done_create_tag") }}</span>
      </button>
    </div>

    <div class="form-field flex col small-padding no-margin">
      <label class="form-label fullwidth" for="dropdown-search-categories">
        {{ $t("tags.search_categories") }}
      </label>
      <input
        type="search"
        v-model="searchValueForCategory"
        class="fullwidth"
        @keydown="keydown"
        id="dropdown-search-categories" />
    </div>
    <TagCategorySearch
      :search="searchValueForCategory"
      :conversationId="conversationId"
      :reload="reloadCategoryList"
      :categoryType="searchCategoryType"
      :categoriesList="categoriesList"
      v-model="_selectedCategory" />
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import TagCategorySearch from "./TagCategorySearch.vue"
import Tag from "@/components/molecules/Tag.vue"
export default {
  props: {
    tagValue: { type: String, required: true },
    conversationId: { type: String, required: false },
    selectedCategory: { type: Object, required: false },
    searchCategoryType: { type: String, default: "conversation_metadata" },
    categoriesList: { type: Array, required: false, default: null }, // if define, search will be done on this list instead of fetching from server
  },
  data() {
    return {
      searchValueForCategory: "",
      reloadCategoryList: false,
    }
  },
  mounted() {},
  computed: {
    _selectedCategory: {
      get: function () {
        return this.selectedCategory
      },
      set: function (value) {
        this.$emit("input", value)
      },
    },
    currentTagcategoryName() {
      return this.selectedCategory
        ? this.selectedCategory.name
        : this.$t("tags.empty_category")
    },
    currentTagcategoryColor() {
      return this?.selectedCategory?.color ?? "white"
    },
  },
  methods: {
    done() {
      this.$emit("done", this.searchValueForCategory)
    },
    keydown(event) {
      event.stopPropagation()
    },
  },
  components: { Fragment, TagCategorySearch, Tag },
}
</script>
