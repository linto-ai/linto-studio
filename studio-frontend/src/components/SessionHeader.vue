<template>
  <ActionBar>
    <div class="flex flex1">
      <div class="flex flex1 session-header-desktop">
        <!-- <router-link
          :to="sessionListRoute"
          class="btn secondary"
          v-if="isAuthenticated">
          <span class="icon back"></span>
          <span class="label">{{
            $t("session.detail_page.back_to_listing")
          }}</span>
        </router-link> -->

        <!-- title -->
        <SessionStatus
          v-if="sessionLoaded"
          :session="session"
          withText
          class="flex1" />
        <div class="flex1" v-else></div>

        <slot name="right-button-desktop"></slot>
      </div>

      <div
        class="flex flex1 mobile session-header-mobile align-center gap-small">
        <router-link
          :to="sessionListRoute"
          class="btn secondary only-icon"
          v-if="isAuthenticated"
          :aria-label="$t('session.detail_page.back_to_listing')">
          <span class="icon back"></span>
        </router-link>
        <div
          class="flex1 text-cut center-text flex align-center justify-center">
          <SessionStatus v-if="sessionLoaded" :session="session" small />
          <h1 class="text-cut" style="min-width: 0; width: fit-content">
            {{ name }}
          </h1>
        </div>

        <slot name="right-button-mobile"></slot>
      </div>
    </div>
  </ActionBar>
</template>
<script>
import { bus } from "@/main.js"
import isAuthenticated from "@/tools/isAuthenticated.js"

import SessionStatus from "@/components/SessionStatus.vue"
import ActionBar from "@/layouts/ActionBar.vue"

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
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    isAuthenticated() {
      return isAuthenticated()
    },
  },
  components: {
    SessionStatus,
    ActionBar,
  },
}
</script>
