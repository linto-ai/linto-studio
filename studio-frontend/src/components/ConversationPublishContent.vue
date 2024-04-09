<template>
  <div class="flex1 flex">
    <object
      class="publish__pdf-wrapper"
      v-if="status === 'displayed' && blobUrl"
      :data="blobUrl"
      type="application/pdf"
      width="100%"
      height="500px">
      <p>Unable to display PDF file</p>
    </object>
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
        {{ $t(`publish.generation_first_line.${format}`) }}
      </h2>
      <div
        :class="'circle-progress-bar-' + Math.trunc(pdfPercentage)"
        class="circle-progress-bar">
        <!-- <progress
          :value="pdfPercentage"
          min="0"
          max="100"
          style="visibility: hidden; height: 0; width: 0"> -->
        <span>{{ pdfPercentage }}%</span>
        <!-- </progress> -->
      </div>

      <!-- <img
        src="/img/typewriter_illustration.svg"
        alt="people drawing"
        class="illustration" /> -->
      <!-- <span class="icon loading"></span> -->
    </div>
    <div v-else class="publish-main__empty">
      <h2>{{ $t(`publish.error_first_line.${format}`) }}</h2>
    </div>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

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
    format: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: false,
    },
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
  },
  data() {
    return {
      loading: true,
      //blobUrl: null,
      currentStatus: null,
    }
  },
  mounted() {},
  components: { Fragment },
}
</script>
