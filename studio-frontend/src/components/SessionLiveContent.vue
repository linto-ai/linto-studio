<template>
  <div class="session-content flex flex1 col" @scroll="handleScroll">
    <div class="medium-margin">
      <h1 class="center-text session-content__title">{{ name }}</h1>
    </div>
    <SessionChannel
      v-if="isConnected"
      :sessionId="session.id"
      :currentOrganizationScope="currentOrganizationScope"
      :fontSize="fontSize"
      :channel="selectedChannel"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :sessionWS="sessionWS"></SessionChannel>
    <Loading v-else></Loading>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import SessionWS from "@/models/SessionWS.js"

import { sessionModelMixin } from "@/mixins/sessionModel.js"

import SessionChannel from "@/components/SessionChannel.vue"
import Loading from "@/components/Loading.vue"

export default {
  mixins: [sessionModelMixin],
  props: {
    selectedChannel: {
      type: Object,
      required: true,
    },
    session: {
      type: Object,
      required: true,
    },
    fontSize: {
      type: String,
      default: "40",
    },
    displaySubtitles: {
      type: Boolean,
      default: true,
    },
    displayLiveTranscription: {
      type: Boolean,
      default: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sessionWS: new SessionWS(),
      isConnected: false,
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.sessionWS.close()
  },
  computed: {
    isInError() {
      return this.selectedChannel?.transcriber_status === "errored"
    },
  },
  methods: {
    async init() {
      await this.sessionWS.connect()
      this.isConnected = true
    },
    handleScroll() {
      console.log("scroll")
    },
  },
  components: { Fragment, SessionChannel, Loading },
}
</script>
