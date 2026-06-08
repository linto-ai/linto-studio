<template>
  <div class="flex flex1 align-center gap-small">
    <SessionStatus
      v-if="sessionLoaded"
      :session="session"
      :small="isMobile"
      showName
      withText
      class="flex1" />

    <SessionLiveActions
      v-if="sessionLoaded && session && showActions"
      :session="session"
      :sessionListRoute="sessionListRoute"
      @session-updated="$emit('session-updated')"
      @paused="$emit('paused')"
      @resumed="$emit('resumed')"
      @cleared="$emit('cleared')"
      @stopped="$emit('stopped')"
      @deleted="$emit('deleted')" />

    <slot></slot>
  </div>
</template>
<script>
import isAuthenticated from "@/tools/isAuthenticated.js"

import SessionStatus from "@/components/SessionStatus.vue"
import SessionLiveActions from "@/components/SessionLiveActions.vue"
import { mapGetters } from "vuex"

export default {
  props: {
    sessionListRoute: {
      type: [String, Object],
      required: true,
    },
    sessionLoaded: {
      type: Boolean,
      required: true,
    },
    session: {
      type: Object,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    showActions: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
    ...mapGetters("system", ["isMobile"]),
  },
  components: {
    SessionStatus,
    SessionLiveActions,
  },
}
</script>
