<template>
  <div class="flex gap-small align-center session-live-actions">
    <!-- Pause -->
    <IsMobile v-if="isActive">
      <Button
        @click="onPause"
        :disabled="busy"
        variant="secondary"
        :aria-label="$t('session.detail_page.pause_button')"
        :title="$t('session.detail_page.pause_button')"
        icon="pause" />
      <template #desktop>
        <Button
          @click="onPause"
          :disabled="busy"
          variant="secondary"
          size="sm"
          :label="$t('session.detail_page.pause_button')"
          icon="pause" />
      </template>
    </IsMobile>

    <!-- Resume -->
    <IsMobile v-else-if="isPaused">
      <Button
        @click="onResume"
        :disabled="busy"
        variant="secondary"
        :aria-label="$t('session.detail_page.resume_button')"
        :title="$t('session.detail_page.resume_button')"
        icon="play" />
      <template #desktop>
        <Button
          @click="onResume"
          :disabled="busy"
          variant="secondary"
          size="sm"
          :label="$t('session.detail_page.resume_button')"
          icon="play" />
      </template>
    </IsMobile>

    <!-- Clear -->
    <IsMobile v-if="isStarted">
      <Button
        @click="openClearConfirm"
        :disabled="busy"
        variant="secondary"
        :aria-label="$t('session.detail_page.clear_button')"
        :title="$t('session.detail_page.clear_button')"
        icon="eraser" />
      <template #desktop>
        <Button
          @click="openClearConfirm"
          :disabled="busy"
          variant="secondary"
          size="sm"
          :label="$t('session.detail_page.clear_button')"
          icon="eraser" />
      </template>
    </IsMobile>

    <!-- Delete (scheduled session, not started yet) -->
    <IsMobile v-if="showDelete && isPending && !isStarted">
      <Button
        :disabled="busy"
        icon="trash"
        intent="destructive"
        variant="primary"
        :aria-label="$t('session.detail_page.delete_session_button')"
        :title="$t('session.detail_page.delete_session_button')"
        @click="onDelete" />
      <template #desktop>
        <Button
          :disabled="busy"
          icon="trash"
          intent="destructive"
          variant="primary"
          size="sm"
          :label="$t('session.detail_page.delete_session_button')"
          @click="onDelete" />
      </template>
    </IsMobile>

    <!-- Stop (ready/pending started, no active stream yet) -->
    <IsMobile v-if="showStop && isStarted && !isActive && !isPaused">
      <Button
        :disabled="busy"
        icon="stop"
        intent="destructive"
        variant="primary"
        :aria-label="$t('session.detail_page.stop_button')"
        :title="$t('session.detail_page.stop_button')"
        @click="onStop" />
      <template #desktop>
        <Button
          :disabled="busy"
          icon="stop"
          intent="destructive"
          variant="primary"
          size="sm"
          :label="$t('session.detail_page.stop_button')"
          @click="onStop" />
      </template>
    </IsMobile>

    <!-- Force stop (session is active or paused — confirm before terminating) -->
    <IsMobile v-if="showStop && (isActive || isPaused)">
      <Button
        :disabled="busy"
        icon="stop"
        intent="destructive"
        variant="primary"
        :aria-label="$t('session.detail_page.stop_force_button')"
        :title="$t('session.detail_page.stop_force_button')"
        @click="openForceStopConfirm" />
      <template #desktop>
        <Button
          :disabled="busy"
          icon="stop"
          intent="destructive"
          variant="primary"
          size="sm"
          :label="$t('session.detail_page.stop_force_button')"
          @click="openForceStopConfirm" />
      </template>
    </IsMobile>

    <ModalClearSession
      v-if="showClearConfirm"
      @on-close="showClearConfirm = false"
      @on-confirm="confirmClear" />

    <ModalForceDeleteSession
      v-if="showForceStopConfirm"
      @on-close="showForceStopConfirm = false"
      @on-confirm="confirmForceStop" />
  </div>
</template>
<script>
import { bus } from "@/main.js"

import { sessionModelMixin } from "@/mixins/sessionModel.js"

import {
  apiPauseSession,
  apiResumeSession,
  apiClearSession,
  apiStopSession,
  apiDeleteSession,
} from "@/api/session.js"

import ModalClearSession from "@/components/ModalClearSession.vue"
import ModalForceDeleteSession from "@/components/ModalForceDeleteSession.vue"

export default {
  name: "SessionLiveActions",
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
    sessionListRoute: {
      type: [String, Object],
      required: false,
      default: null,
    },
    showStop: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
  },
  data() {
    return {
      busy: false,
      showClearConfirm: false,
      showForceStopConfirm: false,
    }
  },
  methods: {
    async onPause() {
      this.busy = true
      const res = await apiPauseSession(this.sessionOrganizationId, this.id)
      this.busy = false
      if (res.status === "error") {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("session.detail_page.pause_session_error_message"),
          timeout: null,
        })
        return
      }
      bus.$emit("app_notif", {
        status: "success",
        message: this.$t("session.detail_page.pause_session_success"),
        timeout: null,
      })
      this.$emit("paused")
      this.$emit("session-updated")
    },
    async onResume() {
      this.busy = true
      const res = await apiResumeSession(this.sessionOrganizationId, this.id)
      this.busy = false
      if (res.status === "error") {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("session.detail_page.resume_session_error_message"),
          timeout: null,
        })
        return
      }
      bus.$emit("app_notif", {
        status: "success",
        message: this.$t("session.detail_page.resume_session_success"),
        timeout: null,
      })
      this.$emit("resumed")
      this.$emit("session-updated")
    },
    openClearConfirm() {
      this.showClearConfirm = true
    },
    async confirmClear() {
      this.showClearConfirm = false
      this.busy = true
      const res = await apiClearSession(this.sessionOrganizationId, this.id)
      this.busy = false
      if (res.status === "error") {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("session.detail_page.clear_session_error_message"),
          timeout: null,
        })
        return
      }
      bus.$emit("app_notif", {
        status: "success",
        message: this.$t("session.detail_page.clear_session_success"),
        timeout: null,
      })
      this.$emit("cleared")
      this.$emit("session-updated")
    },
    async onStop() {
      this.busy = true
      const res = await apiStopSession(this.sessionOrganizationId, this.id)
      this.busy = false
      if (res.status === "error") {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("session.detail_page.stop_session_error_message"),
          timeout: null,
        })
        return
      }
      bus.$emit("app_notif", {
        status: "success",
        message: this.$t("session.detail_page.stop_session_success"),
        timeout: null,
      })
      this.$emit("stopped")
      if (this.sessionListRoute) {
        this.$router.push(this.sessionListRoute)
      }
    },
    openForceStopConfirm() {
      this.showForceStopConfirm = true
    },
    confirmForceStop() {
      this.showForceStopConfirm = false
      this.onStop()
    },
    async onDelete() {
      this.busy = true
      const res = await apiDeleteSession(this.sessionOrganizationId, this.id)
      this.busy = false
      if (res.status === "error") {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("session.detail_page.delete_session_error_message"),
          timeout: null,
        })
        return
      }
      this.$emit("deleted")
      if (this.sessionListRoute) {
        this.$router.replace(this.sessionListRoute)
      }
    },
  },
  components: {
    ModalClearSession,
    ModalForceDeleteSession,
  },
}
</script>
