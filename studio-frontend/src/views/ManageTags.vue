<template>
  <MainContent sidebar box>
    <section
      class="flex col align-top gap-medium flex1"
      v-if="!loadingCategories">
      <h2>{{ $t("manage_tags.subtitle") }}</h2>
      <div class="flex">
        <button
          @click="modalCreateCategoryOpenHandler"
          v-if="isAtLeastMaintainer">
          <span class="icon add" />
          <span class="label">{{
            $t("manage_tags.create_category_button")
          }}</span>
        </button>
      </div>
      <div class="flex wrap align-top gap-medium justify-center">
        <TagCategoryBoxEditable
          v-for="category of categories"
          :startOpen="!!category.tags && category.tags.length > 0"
          :key="category._id"
          :value="selectedTags"
          :category="category"
          :organizationId="currentOrganizationScope"
          :editable="isAtLeastMaintainer"
          @edit="modalCategoryOpenHandler(category)"
          @edit-tag="modalTagOpenHandler"
          @delete-tag="modalDeleteTagOpenHandler"
          @delete-category="modalDeleteCategoryOpenHandler"
          style="width: 18rem" />
      </div>
      <div
        v-if="categories.length == 0"
        class="flex1 flex col align-center justify-center fullwidth center-text">
        <h2>{{ $t("explore.no_categories_modal") }}</h2>
        <router-link :to="{ name: 'inbox' }" class="underline">
          <span>{{ $t("explore.link_to_inbox") }}</span>
        </router-link>
      </div>
    </section>
    <div class="flex flex1 relative" v-else>
      <Loading />
    </div>

    <ModalEditCategory
      v-if="modalCategoryIsOpen"
      :currentOrganizationScope="currentOrganizationScope"
      :category="editCategoryValue"
      @on-cancel="modalCategoryCloseHandler"
      @on-confirm="editCategory" />

    <ModalEditTag
      v-if="modalTagIsOpen"
      :currentOrganizationScope="currentOrganizationScope"
      :tag="editTagValue"
      @on-cancel="modalTagCloseHandler"
      @on-confirm="editTag" />

    <ModalDeleteTag
      v-if="modalDeleteTagIsOpen"
      :currentOrganizationScope="currentOrganizationScope"
      :tag="editTagValue"
      @on-cancel="modalDeleteTagCloseHandler"
      @on-confirm="modalDeleteTagCloseHandler" />

    <ModalDeleteCategory
      v-if="modalDeleteCategoryIsOpen"
      :currentOrganizationScope="currentOrganizationScope"
      :category="editCategoryValue"
      @on-cancel="modalDeleteCategoryCloseHandler"
      @on-confirm="deleteCategory" />

    <ModalCreateCategory
      v-if="modalCreateCategoryIsOpen"
      :currentOrganizationScope="currentOrganizationScope"
      @on-cancel="modalCreateCategoryCloseHandler"
      @on-confirm="createCategory" />
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { apiGetAllCategories } from "@/api/tag.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"

import MainContent from "@/components/MainContent.vue"
import TagCategoryBoxEditable from "@/components/TagCategoryBoxEditable.vue"
import Loading from "@/components/Loading.vue"
import ModalEditCategory from "../components/ModalEditCategory.vue"
import ModalEditTag from "../components/ModalEditTag.vue"
import ModalDeleteTag from "../components/ModalDeleteTag.vue"
import ModalDeleteCategory from "../components/ModalDeleteCategory.vue"
import ModalCreateCategory from "../components/ModalCreateCategory.vue"
export default {
  mixins: [orgaRoleMixin],
  props: {
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedTags: [],
      categories: [],
      loadingCategories: false,
      modalCategoryIsOpen: false,
      editCategoryValue: null,
      modalTagIsOpen: false,
      modalDeleteTagIsOpen: false,
      editTagValue: null,
      modalDeleteCategoryIsOpen: false,
      modalCreateCategoryIsOpen: false,
    }
  },
  mounted() {
    this.queryCategories()
  },
  methods: {
    queryCategories() {
      this.loadingCategories = true
      apiGetAllCategories(this.currentOrganizationScope)
        .then((response) => {
          this.categories = response
          this.loadingCategories = false
        })
        .catch((error) => {
          this.loadingCategories = false
        })
    },
    modalCategoryOpenHandler(category) {
      this.editCategoryValue = category
      this.modalCategoryIsOpen = true
    },
    editCategory({ name, color }) {
      this.modalCategoryIsOpen = false
      this.categories = this.categories.map((category) => {
        if (category._id === this.editCategoryValue._id) {
          category.name = name
          category.color = color
        }
        return category
      })
      this.editCategoryValue = null
      //this.queryCategories()
    },
    updateCategoryValue(newCategory) {
      this.categories = this.categories.map((category) => {
        if (category._id === newCategory._id) {
          return newCategory
        }
        return category
      })
    },
    modalCategoryCloseHandler() {
      this.modalCategoryIsOpen = false
      this.editCategoryValue = null
      //this.queryCategories()
    },
    modalTagOpenHandler(tag) {
      this.editTagValue = tag
      this.modalTagIsOpen = true
    },
    modalTagCloseHandler() {
      this.modalTagIsOpen = false
      this.editTagValue = null
    },
    modalDeleteTagOpenHandler(tag) {
      this.editTagValue = tag
      this.modalDeleteTagIsOpen = true
    },
    modalDeleteTagCloseHandler() {
      this.modalDeleteTagIsOpen = false
      this.editTagValue = null
    },
    modalDeleteCategoryOpenHandler(category) {
      this.editCategoryValue = category
      this.modalDeleteCategoryIsOpen = true
    },
    modalDeleteCategoryCloseHandler() {
      this.modalDeleteCategoryIsOpen = false
      this.editCategoryValue = null
    },
    deleteCategory() {
      this.modalDeleteCategoryIsOpen = false
      this.categories = this.categories.filter(
        (category) => category._id !== this.editCategoryValue._id,
      )
      this.editCategoryValue = null
      //this.queryCategories()
    },
    editTag({ name, categoryId }) {
      bus.$emit("tag-category-changed", {
        categoryIdTarget: categoryId,
      })
      this.modalTagIsOpen = false
      this.editTagValue = null
      //this.queryCategories()
    },
    createCategory() {
      this.modalCreateCategoryIsOpen = false
      this.queryCategories()
    },
    modalCreateCategoryCloseHandler() {
      this.modalCreateCategoryIsOpen = false
    },
    modalCreateCategoryOpenHandler() {
      this.modalCreateCategoryIsOpen = true
    },
  },
  components: {
    Fragment,
    MainContent,
    Loading,
    ModalEditCategory,
    ModalEditTag,
    ModalDeleteTag,
    ModalDeleteCategory,
    ModalCreateCategory,
    TagCategoryBoxEditable,
  },
}
</script>
