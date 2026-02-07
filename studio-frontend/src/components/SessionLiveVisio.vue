<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:sidebar>
      <SessionLiveToolbar
        :channels="channels"
        :qualifiedForCrossSubtitles="qualifiedForCrossSubtitles"
        v-bind:selectedTranslation.sync="selectedTranslation"
        v-bind:displayLiveTranscription.sync="displayLiveTranscription"
        v-bind:displaySubtitles.sync="displaySubtitles"
        v-bind:fontSize.sync="fontSize"
        v-bind:selectedChannel.sync="selectedChannel"
        quickSession />
    </template>
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div style="font-style: italic">({{ quickSessionBot?.url }})</div>
        <div class="flex1"></div>
        <Button
          @click="$emit('onSave')"
          :label="$t('quick_session.live.save_button')"
          variant="primary"
          size="sm" />
      </div>
    </template>
    <SessionLiveContent
      :websocketInstance="$apiEventWS"
      :organizationId="currentOrganizationScope"
      displayLiveTranscription
      fromVisio
      :session="session"
      :displaySubtitles="displaySubtitles"
      :displayLiveTranscription="displayLiveTranscription"
      :fontSize="fontSize"
      customTitle="Quick meeting"
      :selectedTranslations="selectedTranslation"
      :selectedChannel="selectedChannel" />
  </V2Layout>
</template>
<script>
import { sessionModelMixin } from "@/mixins/sessionModel.js"

import { customDebug } from "@/tools/customDebug.js"

import MainContent from "@/components/MainContent.vue"
import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import StatusLed from "@/components/atoms/StatusLed.vue"
import V2Layout from "@/layouts/v2-layout.vue"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
    quickSessionBot: {
      type: Object,
      required: true,
    },
    // visioType: {
    //   type: String,
    //   required: true,
    // },
    // visioUrl: {
    //   type: String,
    //   required: true,
    // },
  },
  data() {
    const currentChannel = this.session.channels[0]
    return {
      debugQuickSession: customDebug("vue:debug:quickSession"),
      selectedTranslation: "original",
      displayLiveTranscription: true,
      displaySubtitles: false,
      fontSize: "40",
      selectedChannel: currentChannel,
    }
  },
  mounted() {},
  methods: {},
  computed: {
    qualifiedForCrossSubtitles() {
      let res = true
      res = res && this.selectedChannel.languages.length == 2
      const translations = this.selectedChannel.translations.map(t =>
        typeof t === 'string' ? t : t.target
      )
      res =
        res &&
        !!translations.find(
          (t) =>
            t.split("-")[0] === this.selectedChannel.languages[0].split("-")[0],
        )
      res =
        res &&
        !!translations.find(
          (t) =>
            t.split("-")[0] === this.selectedChannel.languages[1].split("-")[0],
        )
      return res
    },
    breadcrumbItems() {
      return [
        {
          label: this.$t("breadcrumb.quickSession_visio"),
        },
      ]
    },
  },
  components: {
    MainContent,
    SessionLiveToolbar,
    SessionLiveContent,
    StatusLed,
    V2Layout,
  },
}
</script>
