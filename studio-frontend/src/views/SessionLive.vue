<template>
  <MainContent noBreadcrumb :organizationPage="false" fullwidthContent sidebar>
    <template v-slot:breadcrumb-actions>
      <router-link :to="sessionListRoute" class="btn secondary">
        <span class="icon back"></span>
        <span class="label">{{
          $t("session.detail_page.back_to_listing")
        }}</span>
      </router-link>

      <!-- title -->
      <SessionStatus
        v-if="sessionLoaded"
        :session="session"
        withText
        class="flex1" />

      <router-link :to="settingsRoute" class="btn" v-if="isAtLeastMaintainer">
        <span class="icon settings"></span>
        <span class="label">{{
          $t("session.detail_page.settings_button")
        }}</span>
      </router-link>
    </template>

    <template v-slot:sidebar>
      <SessionLiveToolbar
        v-if="sessionLoaded"
        :channels="channels"
        v-bind:selectedTranslation.sync="selectedTranslation"
        v-bind:displayLiveTranscription.sync="displayLiveTranscription"
        v-bind:displaySubtitles.sync="displaySubtitles"
        v-bind:fontSize.sync="fontSize"
        v-bind:selectedChannel.sync="selectedChannel" />
    </template>

    <div class="relative flex flex1 col">
      <!-- <SessionNotStarted v-if="isPending" /> -->

      <Loading v-if="!sessionLoaded || !selectedChannel" />

      <SessionEnded
        v-else-if="isTerminated"
        :session="session"
        :isFromPublicLink="isFromPublicLink" />

      <SessionLiveContent
        v-else
        :selectedTranslations="selectedTranslation"
        :organizationId="organizationId"
        :fontSize="fontSize"
        :displaySubtitles="displaySubtitles"
        :displayLiveTranscription="displayLiveTranscription"
        :session="session"
        :selectedChannel="selectedChannel" />
    </div>
  </MainContent>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "../main.js"

import EMPTY_FIELD from "@/const/emptyField"

import { sessionMixin } from "@/mixins/session.js"
import { orgaRoleMixin } from "@/mixins/orgaRole"

import MainContent from "@/components/MainContent.vue"
import SessionNotStarted from "@/components/SessionNotStarted.vue"
import SessionChannelsSelector from "@/components/SessionChannelsSelector.vue"
import SessionTranslationSelection from "@/components/SessionTranslationSelection.vue"
import SessionLiveContent from "@/components/SessionLiveContent.vue"
import Loading from "@/components/Loading.vue"
import FormInput from "@/components/FormInput.vue"
import FormCheckbox from "@/components/FormCheckbox.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import SessionStatus from "@/components/SessionStatus.vue"
import SessionLiveToolbar from "@/components/SessionLiveToolbar.vue"

export default {
  mixins: [sessionMixin, orgaRoleMixin],
  props: {},
  data() {
    const { subtitles, liveTranscription = "true" } = this.$route.query

    return {
      selectedChannel: null,
      selectedTranslation: null,
      fontSize: "40",
      displaySubtitles: subtitles === "true",
      displayLiveTranscription: liveTranscription === "true",
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
        this.selectedTranslation = "original"
      }
    },
    displaySubtitles(value) {
      this.updateUrl()
    },
    displayLiveTranscription(value) {
      this.updateUrl()
    },
    selectedChannel() {
      this.selectedTranslation = "original"
    },
  },
  methods: {
    updateUrl() {
      // add liveTranscription and subtitles to url and selectedChannel
      history.pushState(
        {},
        "",
        `${this.$route.path}?subtitles=${this.displaySubtitles}&liveTranscription=${this.displayLiveTranscription}`,
      )
    },
  },
  components: {
    Fragment,
    MainContent,
    SessionNotStarted,
    SessionChannelsSelector,
    SessionTranslationSelection,
    SessionLiveContent,
    SessionLiveToolbar,
    Loading,
    FormInput,
    FormCheckbox,
    SessionEnded,
    SessionStatus,
  },
}
</script>
