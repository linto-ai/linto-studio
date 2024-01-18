<template>
  <div class="highlights-list flex col gap-medium">
    <h3
      class="center-text flex align-center highlights-list__title"
      @click="openHighlightModal">
      <span>{{ $t("app_editor_highlights_modal.ia_title") }}</span>
      <span class="icon medium settings"></span>
    </h3>
    <!-- <button class="green" @click="openHighlightModal" v-if="!loading">
      <span class="icon add"></span>
      <span class="label"></span>
    </button> -->
    <AppEditorHighLightModal
      v-if="showHighlightModal"
      :servicesList="services"
      :hightlightsCategories="hightlightsCategories"
      @on-confirm="generateKeywords"
      @on-cancel="closeHighlightModal">
    </AppEditorHighLightModal>
    <TagCategoryBoxHighlight
      v-if="!loading"
      v-for="cat of hightlightsCategories"
      :key="cat._id"
      :category="cat"
      :job="getJobsFromService(cat.name)"
      :conversationId="conversationId"></TagCategoryBoxHighlight>
    <div v-if="loading" class="center-text small-padding">
      <!-- <div>Querying Ai services</div> -->
      <div>{{ $t("app_editor_highlights_modal.loading_services") }}</div>
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
import AppEditorHighLightModal from "./AppEditorHighLightModal.vue"
import { workerSendMessage } from "../tools/worker-message"

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
      showHighlightModal: false,
    }
  },
  async mounted() {
    await this.getServices()
    await this.getHightlightsCategories()
    this.loading = false
  },
  beforeDestroy() {},
  computed: {
    jobs() {
      return this.conversation?.jobs || {}
    },
    getJobsFromService() {
      return (name) => this.jobs[name] || null
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
    openHighlightModal() {
      this.showHighlightModal = true
    },
    closeHighlightModal() {
      this.showHighlightModal = false
    },
    generateKeywords(services) {
      for (let service of services) {
        workerSendMessage("fetch_hightlight", {
          serviceScope: "", //service.scope,
          categoryName: service.categoryName,
        })
      }
      this.closeHighlightModal()
    },
  },
  components: { Fragment, TagCategoryBoxHighlight, AppEditorHighLightModal },
}
</script>
