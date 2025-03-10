<template>
  <div class="flex1 flex">
    <div v-if="statusIsInError" class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
    </div>
    <object
      v-else-if="status === 'complete' && blobUrl"
      class="publish__pdf-wrapper"
      :data="blobUrl"
      type="application/pdf"
      width="100%"
      height="500px">
      <p>Unable to display PDF file</p>
    </object>
    <div
      v-else-if="status === 'complete' && mardownContent"
      class="publish-main__content publish__markdown-wrapper">
      <MarkdownEditor :value="mardownContent"></MarkdownEditor>
      <!-- <div v-html="htmlFromMarkdown"></div> -->
    </div>
    <div
      v-else-if="status === 'complete'"
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.loading_document") }}</h2>
      <span class="icon loading"></span>
    </div>
    <div
      v-else-if="status === 'queued' || pdfPercentage === 'Processing 0%'"
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">{{ $t("publish.queued.title") }}</h2>
      <img
        src="/img/compass_illustration.svg"
        alt="processing"
        class="illustration" />
      <span class="icon loading"></span>
    </div>
    <div
      v-else-if="status === 'processing'"
      class="flex col center-text publish-main__loading align-center flex1 justify-center">
      <h2 class="center-text">
        {{ $t(`publish.generation_first_line.general`) }}
      </h2>
      <div
        :class="'circle-progress-bar-' + Math.trunc(pdfPercentage)"
        class="circle-progress-bar">
        <span>{{ pdfPercentage }}%</span>
      </div>
    </div>
    <div v-else class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.generic`) }}</h2>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"
import MarkdownEditor from "./MardownWYSIWYGEditor.vue"

export default {
  props: {
    status: {
      type: String,
      required: false,
    }, // generating, displayed, error
    blobUrl: {
      type: String,
      required: false,
    },
    pdfPercentage: {
      type: Number,
      required: false,
    },
    mardownContent: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      loading: true,
      currentStatus: null,
    }
  },
  computed: {
    statusIsInError() {
      return this.status === "error" || this.status === "unknown"
    },
  },

  mounted() {},
  components: { Fragment, MarkdownEditor },
}
</script>
