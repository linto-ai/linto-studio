<template>
  <MainContent noBreadcrumb :organizationPage="false" box>
    <template v-slot:breadcrumb-actions>
      <div class="flex flex1 gap-medium align-center justify-center">
        <router-link :to="sessionListRoute" class="btn secondary">
          <span class="icon back"></span>
          <span class="label">{{
            $t("session.detail_page.back_to_listing")
          }}</span>
        </router-link>

        <!-- title -->
        <div
          class="flex flex1 center-text align-center justify-center"
          v-if="isPending">
          <span class="icon clock"></span>
          <span>{{
            $t("session.detail_page.sessions_status.no_started")
          }}</span>
        </div>

        <div
          class="flex flex1 center-text align-center justify-center"
          v-else-if="isStarted">
          <span class="icon reload"></span>
          <span>{{ $t("session.detail_page.sessions_status.started") }}</span>
        </div>

        <div
          class="flex flex1 center-text align-center justify-center"
          v-else></div>

        <router-link :to="liveRoute" class="btn">
          <span class="icon text"></span>
          <span class="label">{{
            $t("session.detail_page.back_to_live")
          }}</span>
        </router-link>
      </div>
    </template>

    <div class="flex gap-medium small-padding border-divider-bottom">
      <div class="flex1"></div>

      <button
        class="btn"
        v-if="isPending"
        @click="startSession"
        :disabled="isStarting">
        <span class="icon play"></span>
        <span class="label">{{ $t("session.detail_page.start_button") }}</span>
      </button>

      <button
        class="btn"
        v-if="isStarted"
        @click="stopSession"
        :disabled="isStoping">
        <span class="icon stop"></span>
        <span class="label">{{ $t("session.detail_page.stop_button") }}</span>
      </button>

      <button
        class="btn red-border"
        @click="openModalDeleteSession"
        :disabled="isDeleting">
        <span class="icon trash"></span>
        <span class="label">{{ $t("session.detail_page.delete_button") }}</span>
      </button>
    </div>
    <SessionSettingsContent v-if="sessionLoaded" :session="session" />

    <ModalDeleteSession
      v-if="showModalDeleteSession"
      @on-close="closeModalDeleteSession"
      @on-confirm="deleteSession" />
  </MainContent>
</template>
<script>
import { bus } from "../main.js"

import { sessionMixin } from "@/mixins/session.js"

import MainContent from "@/components/MainContent.vue"
import SessionSettingsContent from "../components/SessionSettingsContent.vue"
import ModalDeleteSession from "../components/ModalDeleteSession.vue"

export default {
  mixins: [sessionMixin],
  props: {},
  data() {
    return {
      showModalDeleteSession: false,
    }
  },
  created() {
    // if not started, redirect to home
  },
  mounted() {},
  methods: {
    openModalDeleteSession() {
      this.showModalDeleteSession = true
    },
    closeModalDeleteSession() {
      this.showModalDeleteSession = false
    },
  },
  components: {
    MainContent,
    SessionSettingsContent,
    ModalDeleteSession,
  },
}
</script>
