<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon back"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-if="isPending">
        <span class="icon clock"></span>
        <span>{{ $t("session.detail_page.sessions_status.no_started") }}</span>
      </div>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-else-if="isStarted">
        <span class="icon reload"></span>
        <span>{{ $t("session.detail_page.sessions_status.started") }}</span>
      </div>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-else-if="isTerminated">
      </div>

      <div
        class="flex flex1 center-text align-center justify-center"
        v-else>
      </div>


      <router-link :to="settingsRoute" class="btn" v-if="isAtLeastMaintainer">
        <span class="icon settings"></span>
        <span class="label">{{
          $t("session.detail_page.settings_button")
        }}</span>
      </router-link>
    </template>

    <template v-slot:sidebar>
      <div class="flex col medium-padding gap-medium" v-if="isStarted || isTerminated">
        <SessionChannelsSelector
          v-if="sessionLoaded && selectedChannel"
          :channels="channels"
          v-model="selectedChannel"
          class="session-selector"></SessionChannelsSelector>

        <h3>{{ $t("session.detail_page.title_interface_settings") }}</h3>
        <FormCheckbox
          disabled
          :field="displayLiveTranscriptionField"
          switchDisplay
          v-model="displayLiveTranscriptionField.value" />
        <FormCheckbox
          disabled
          :field="displaySubtitlesField"
          switchDisplay
          v-model="displaySubtitlesField.value" />

        <FormInput
          :field="fontSizeField"
          v-model="fontSizeField.value"
          v-if="displaySubtitlesField.value" />
      </div>
    </template>

    <div class="relative flex flex1 col">
      <SessionNotStarted v-if="isPending" />
      
      <Loading v-else-if="!sessionLoaded || !selectedChannel" />

      <SessionEnded v-else-if="isTerminated" :session="session" :isFromPublicLink="isFromPublicLink"/>

      <SessionLiveContent
        v-else
        :organizationId="organizationId"
        :fontSize="fontSizeField.value"
        :displaySubtitles="displaySubtitlesField.value"
        :displayLiveTranscription="displayLiveTranscriptionField.value"
        :session="session"
        :selectedChannel="selectedChannel" />
    </div>
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import EMPTY_FIELD from "../const/emptyField"

import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import Loading from "@/components/Loading.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "../components/FormCheckbox.vue"
import SessionEnded from "../components/SessionEnded.vue"

export default {
  mixins: [sessionMixin, orgaRoleMixin],
  props: {},
  data() {
    const { subtitles, liveTranscription = "true" } = this.$route.query

    return {
      selectedChannel: null,
      fontSizeField: {
        ...EMPTY_FIELD,
        value: "40",
        label: this.$t("session.detail_page.font_size_label"),
        type: "number",
        customParams: {
          min: 12,
          max: 68,
        },
      },
      displaySubtitlesField: {
        ...EMPTY_FIELD,
        value: subtitles === "true",
        label: this.$t("session.detail_page.display_subtitles_label"),
      },
      displayLiveTranscriptionField: {
        ...EMPTY_FIELD,
        value: liveTranscription === "true",
        label: this.$t("session.detail_page.display_live_transcription_label"),
      },
    }
  },
  created() {
    // TODO:
    // if not started, redirect to home
    // if stopped, redirect to conversation
  },
  mounted() {},
  watch: {
    sessionLoaded() {
      if (this.sessionLoaded) {
        this.selectedChannel = this.channels[0]
      }
    },
    "displaySubtitlesField.value"(value) {
      this.updateUrl()
    },
    "displayLiveTranscriptionField.value"(value) {
      this.updateUrl()
    },
  },
  methods: {
    updateUrl() {
      // add liveTranscription and subtitles to url and selectedChannel
      history.pushState(
        {},
        "",
        `${this.$route.path}?subtitles=${this.displaySubtitlesField.value}&liveTranscription=${this.displayLiveTranscriptionField.value}`
      )
    },
  },
  components: {
    Fragment,
    MainContent,
    SessionNotStarted,
    SessionChannelsSelector,
    SessionLiveContent,
    Loading,
    FormInput,
    FormCheckbox,
    SessionEnded,
  },
}
</script>
