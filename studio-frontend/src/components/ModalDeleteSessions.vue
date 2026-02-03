<template>
  <ModalNew
    value
    @on-cancel="() => this.$emit('on-close')"
    @on-delete="deleteSessions"
    :title="title"
    :actionBtnLabel="actionBtnLabel"
    withActionDelete
    :withActionApply="false"
    size="sm">
    {{ $tc("modal_delete_sessions.content", selectedSessions.length) }}
  </ModalNew>
</template>

<script>
import { apiAdminDeleteSession } from "@/api/admin.js"
import bulkRequest from "@/tools/bulkRequest.js"
import { bus } from "@/main"

import ModalNew from "@/components/molecules/Modal.vue"

export default {
  props: {
    selectedSessions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: this.$tc(
        "modal_delete_sessions.title",
        this.selectedSessions.length,
      ),
      actionBtnLabel: this.$tc(
        "modal_delete_sessions.action_btn",
        this.selectedSessions.length,
      ),
    }
  },
  methods: {
    async deleteSessions() {
      const req = await bulkRequest(
        apiAdminDeleteSession,
        this.selectedSessions.map((id) => [id]),
        (count) => {
          bus.$emit("app_notif", {
            status: "loading",
            message: this.$i18n.t(
              "modal_delete_sessions.loading_notification",
              {
                count,
                total: this.selectedSessions.length,
              },
            ),
            cantBeClosed: false,
          })
        },
      )

      if (req.status === "success") {
        this.$emit("on-confirm")
        bus.$emit("app_notif", {
          status: "success",
          message: this.$i18n.tc(
            "modal_delete_sessions.success_notification",
            this.selectedSessions.length,
          ),
        })
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$tc(
            "modal_delete_sessions.error",
            this.selectedSessions.length,
          ),
        })
        this.$emit("on-close")
      }
    },
  },
  components: { ModalNew },
}
</script>
