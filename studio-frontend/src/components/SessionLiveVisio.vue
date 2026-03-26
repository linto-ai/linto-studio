<template>
  <V2Layout :breadcrumbItems="breadcrumbItems">
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
    <div class="flex flex1 col">
      <SessionLiveNG
        :session="session"
        :websocketInstance="$apiEventWS" />
    </div>
  </V2Layout>
</template>
<script>
import SessionLiveNG from "@/components/SessionLiveNG.vue"
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
  },
  components: {
    SessionLiveNG,
    V2Layout,
  },
}
</script>
