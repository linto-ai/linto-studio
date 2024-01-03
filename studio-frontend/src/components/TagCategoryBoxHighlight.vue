<template>
  <TagCategoryBox
    :category="category"
    scope="conversation"
    :scopeId="conversationId"
    :selectable="false"
    :fixed="empty">
    <template v-slot:content-just-before-title="slotProps">
      <span class="icon ai"></span>
    </template>

    <template v-slot:content-after-title="slotProps">
      <button class="green" @click="generateKeyword" v-if="!loading && empty">
        <span class="icon plus"></span>
      </button>
      <span class="icon loading" v-else-if="loading"></span>
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
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    empty() {
      return this.category.tags.length === 0
    },
  },
  mounted() {},
  methods: {
    generateKeyword() {
      if (this.loading) {
        return
      }
      console.log(this.category)
      this.loading = true
      workerSendMessage("fetch_hightlight", {
        serviceScope: this.category.scope,
        categoryName: this.category.name,
      })
      console.log("generate keyword")
    },
  },
  components: { Fragment, TagCategoryBox },
}
</script>
