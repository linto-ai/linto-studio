<template>
  <Fragment>
    <div class="dropDown-section flex col gap-small">
      <div v-if="search && !foundExactCategorie">
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
import { bus } from "@/main.js"
import { apiSearchCategories, apiGetAllCategories } from "../api/tag.js"
import { debounceMixin } from "../mixins/debounce"

import Loading from "@/components/atoms/Loading.vue"

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
    categoriesList: { type: Array, required: false, default: null }, // if define, search will be done on this list instead of fetching from server
  },
  mixins: [debounceMixin],
  data() {
    return {
      searchedCategories: [],
      searchId: uuidv4(),
      loading: false,
      foundExactCategorie: null,
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
    searchedCategories: {
      handler(newCategories, oldCategories) {
        this.foundExactCategorie = newCategories.find(
          (category) => category.name === this.search,
        )
        if (this.foundExactCategorie) {
          this.selectedCategory = this.foundExactCategorie
        }
      },
      deep: true,
    },
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
        signal,
      )
    },
    async fetchSearchResult(newSearch) {
      this.loading = true
      if (!newSearch) {
        if (this.categoriesList !== null) {
          this.searchedCategories = this.categoriesList.filter((category) =>
            category.name.includes(newSearch),
          )
          this.loading = false
          return
        }

        this.searchedCategories = await apiGetAllCategories(
          this.conversationId,
          this.categoryType,
          "conversation",
        )
      } else {
        this.searchedCategories = await this.debouncedSearch(
          this.apiSearchCategoriesWithOrga.bind(this),
          newSearch,
        )
      }
      this.loading = false
    },
  },
  components: { Fragment, Loading },
}
</script>
