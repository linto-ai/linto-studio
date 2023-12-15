<template>
  <Fragment>
    <div class="dropDown-section flex col gap-small">
      <div v-if="search">
        <input
          type="radio"
          :id="`${searchId}-custom`"
          :value="{ name: search }"
          v-model="selectedCategory" />
        <label :for="`${searchId}-custom`">
          {{ search }}
        </label>
      </div>

      <div v-if="loading" class="flex1 relative" style="min-height: 50px">
        <Loading />
      </div>
      <div v-else v-for="category of searchedCategories">
        <input
          type="radio"
          :id="`${searchId}-${category._id}`"
          :value="category"
          v-model="selectedCategory" />
        <label
          :for="`${searchId}-${category._id}`"
          :class="`color-${category.color}-900`">
          {{ category.name }}
        </label>
      </div>
      <!-- <div v-if="searchedCategories.length === 0">
        {{ $t("tags.no_categories_found") }}
      </div> -->
    </div>
  </Fragment>
</template>
<script>
import uuidv4 from "uuid/v4.js"
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { apiSearchCategories, apiGetAllCategories } from "../api/tag.js"
import { debounceMixin } from "../mixins/debounce"

import Loading from "./Loading.vue"

export default {
  props: {
    search: { type: String, default: "" },
    currentOrganizationScope: { type: String, required: false },
    conversationId: { type: String, required: true },
    reload: { type: Boolean, default: false },
    value: { type: Object, default: null },
    categoryType: {
      type: String,
      default: "conversation_metadata",
      required: false,
    },
  },
  mixins: [debounceMixin],
  data() {
    return {
      searchedCategories: [],
      searchId: uuidv4(),
      loading: false,
    }
  },
  mounted() {
    this.fetchSearchResult(this.search)
  },
  computed: {
    selectedCategory: {
      get: function () {
        return this.value
      },
      set: function (value) {
        console.log(value)
        // Communicate the change to parent component so that selectedValue can be updated
        this.$emit("input", value)
      },
    },
  },
  watch: {
    search(newSearch, oldSearch) {
      this.fetchSearchResult(newSearch)
      this.selectedCategory = { name: newSearch }
    },
    /*selectedCategory: function (newCategory, oldCategory) {
      console.log(newCategory)
      if (newCategory) {
        this.$emit("input", newCategory)
      }
    },*/
    reload() {
      this.fetchSearchResult(this.search)
    },
  },
  methods: {
    apiSearchCategoriesWithOrga(search, signal) {
      return apiSearchCategories(
        this.conversationId,
        search,
        this.categoryType,
        "conversation",
        signal
      )
    },
    async fetchSearchResult(newSearch) {
      this.loading = true
      if (!newSearch) {
        this.searchedCategories = await apiGetAllCategories(
          this.conversationId,
          "conversation_metadata",
          "conversation"
        )
      } else {
        this.searchedCategories = await this.debouncedSearch(
          this.apiSearchCategoriesWithOrga.bind(this),
          newSearch
        )
      }
      this.loading = false
    },
  },
  components: { Fragment, Loading },
}
</script>
