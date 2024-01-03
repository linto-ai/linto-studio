<template>
  <div class="highlights-list">
    <h2 class="center-text">IA insight</h2>
    <TagCategoryBoxHighlight
      v-if="!loading"
      v-for="cat of hightlightsCategories"
      :key="cat._id"
      :category="cat"
      :job="getJobsFromService(cat.name)"
      :conversationId="conversationId"></TagCategoryBoxHighlight>
    <div v-if="loading" class="center-text small-padding">
      <div>Querying Ai services</div>
      <span class="icon loading"></span>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import { apiGetAllCategories } from "../api/tag.js"
import { apiGetNlpService } from "../api/service.js"
import TagCategoryBoxHighlight from "./TagCategoryBoxHighlight.vue"

export default {
  props: {
    conversationId: {
      type: String,
      required: true,
    },
    conversation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      services: [],
      hightlightsCategories: [],
      loading: true,
    }
  },
  async mounted() {
    await this.getServices()
    await this.getHightlightsCategories()
    this.loading = false
  },
  beforeDestroy() {
    bus.$off("refresh_keywords")
  },
  computed: {
    jobs() {
      return this.conversation?.jobs || {}
    },
  },
  methods: {
    async getServices() {
      const req = await apiGetNlpService()
      this.services = req
    },
    async getHightlightsCategories() {
      const req = await apiGetAllCategories(
        this.conversationId,
        "highlight",
        "conversation",
        true,
        true
      )
      this.hightlightsCategories = req
    },
    getJobsFromService(name) {
      return this.jobs[name] || null
    },
  },
  components: { Fragment, TagCategoryBoxHighlight },
}
</script>
