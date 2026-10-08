<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
    <template v-slot:breadcrumb-actions>
      <div class="flex1 flex gap-small align-center">
        <div style="font-style: italic">({{ quickSessionBot?.url }})</div>
        <div class="flex1"></div>
        <template v-if="!isSessionTerminated">
          <SessionLiveActions
            :session="session"
            :showStop="false"
            :showDelete="false"
            fakeStatus="active"
            :disablePauseResume="true" />
          <Button
            @click="$emit('onSave')"
            :label="$t('quick_session.live.save_button')"
            variant="primary"
            size="sm" />
        </template>
      </div>
    </template>
    <div class="flex flex1 col">
      <SessionEnded v-if="isSessionTerminated" :session="session" />
      <SessionLiveNG
        v-else-if="isFirstChannelLive"
        :session="session"
        :currentOrganizationScope="currentOrganizationScope"
        :websocketInstance="$apiEventWS" />
      <VisioPlaceholder v-else />
    </div>
  </V2Layout>
</template>
<script>
import SessionLiveNG from "@/components/SessionLiveNG.vue"
import SessionLiveActions from "@/components/SessionLiveActions.vue"
import VisioPlaceholder from "@/components/molecules/VisioPlaceholder.vue"
import SessionEnded from "@/components/SessionEnded.vue"
import V2Layout from "@/layouts/v2-layout.vue"

export default {
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
  },
  computed: {
    breadcrumbItems() {
      return [
        {
          label: this.$t("breadcrumb.quickSession_visio"),
        },
      ]
    },
    // Ended or deleted elsewhere, see sessions/applySessionsUpdate
    isSessionTerminated() {
      return this.session.status === "terminated"
    },
    isFirstChannelLive() {
      return this.session.channels?.[0]?.enableLiveTranscripts
    },
  },
  components: {
    SessionLiveNG,
    SessionLiveActions,
    V2Layout,
    VisioPlaceholder,
    SessionEnded,
  },
}
</script>
