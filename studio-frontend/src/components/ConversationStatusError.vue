<template>
  <V2Layout>
    <template v-slot:breadcrumb-actions>
      <router-link :to="conversationListRoute" class="btn">
        <span class="icon back"></span>
        <span class="label">{{
          $t("conversation.status_page.return_to_medias_list_button")
        }}</span>
      </router-link>
      <h1
        class="flex1 center-text text-cut"
        style="padding-left: 1rem; padding-right: 1rem">
        {{ conversation.name }}
      </h1>
      <router-link
        :to="conversationListRoute"
        class="btn"
        style="visibility: hidden">
        <span class="icon back"></span>
        <span class="label">{{
          $t("conversation.status_page.return_to_medias_list_button")
        }}</span>
      </router-link>
    </template>
    <div
      class="flex col flex1 gap-medium align-center conversation-status-error">
      <h2 class="center-text">
        {{ $t("conversation.status_page.error_title") }}
      </h2>
      <div>{{ $t("conversation.status_page.error_log_label") }}</div>
      <pre class="error-log">
        {{ errorLog }}
      </pre>
      <div>
        <router-link :to="conversationListRoute" class="btn">
          <span class="icon back"></span>
          <span class="label">{{
            $t("conversation.status_page.return_to_medias_list_button")
          }}</span>
        </router-link>
      </div>
    </div>
  </V2Layout>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import V2Layout from "@/layouts/v2-layout.vue"

// todo: fetch log from https://alpha.api.linto.ai/stt-french-generic/job-log/<job_id>

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logs: "loading...",
    }
  },
  computed: {
    errorLog() {
      return this.conversation?.jobs?.transcription?.job_logs ?? "No logs"
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
  },
  mounted() {},
  methods: {
    fetchLogs() {
      const job_id = this.conversation.transcription.job_id
    },
  },
  components: { Fragment, V2Layout },
}
</script>
