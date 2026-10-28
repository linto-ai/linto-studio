<template>
  <V2Layout>
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
        <Button
          :to="conversationListRoute"
          icon="arrow-left"
          :label="
            $t('conversation.status_page.return_to_medias_list_button')
          " />
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
