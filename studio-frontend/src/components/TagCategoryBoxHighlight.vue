<template>
  <TagCategoryBox
    v-if="!empty"
    :key="reload"
    :category="_category"
    scope="conversation"
    :scopeId="conversationId"
    :selectable="false"
    :fixed="empty">
    <template v-slot:content-just-before-title="slotProps">
      <span class="icon ai"></span>
    </template>

    <template v-slot:content-after-title="slotProps">
      <!-- <button class="green" @click="generateKeyword" v-if="!loading && empty">
        <span class="icon plus"></span>
      </button> -->
      <span class="icon loading" v-if="loading"></span>
      <span
        class="icon show"
        v-if="!loading && !empty && show"
        @click="hideCategory"></span>
      <span
        class="icon hide"
        v-if="!loading && !empty && !show"
        @click="showCategory"></span>
    </template>
  </TagCategoryBox>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import TagCategoryBox from "./TagCategoryBox.vue"
import { workerSendMessage } from "../tools/worker-message.js"

export default {
  props: {
    category: { type: Object, required: true },
    conversationId: { type: String, required: true },
    job: { type: Object, required: false },
    show: { type: Boolean, required: false },
  },
  data() {
    return {
      reload: false,
    }
  },
  watch: {
    job: {
      handler: function (val, oldVal) {
        const status = val.state
        if (status === "done") {
          this.reload = !this.reload
        }
      },
      deep: true,
    },
  },
  computed: {
    empty() {
      return this.category.tags.length === 0 && !this.loading
    },
    loading() {
      const status = this.job?.state
      return (
        status === "running" || status === "pending" || status === "started"
      )
    },
    _category() {
      return {
        ...this.category,
        name: this.getName(this.category.scope) ?? this.category.name,
      }
    },
  },
  mounted() {},
  methods: {
    getName(scope) {
      switch (scope) {
        case "nlp-keyword":
          return this.$t("highlights_name.keyword")
        default:
          return null
      }
    },
    showCategory(e) {
      this.$emit("show-category", this.category._id)
      e.stopPropagation()
    },
    hideCategory(e) {
      this.$emit("hide-category", this.category._id)
      e.stopPropagation()
    },
  },
  components: { Fragment, TagCategoryBox },
}
</script>
