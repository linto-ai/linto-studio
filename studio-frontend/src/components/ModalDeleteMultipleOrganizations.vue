<template>
  <ModalNew
    value
    @on-cancel="() => this.$emit('on-close')"
    @on-confirm="deleteOrganizations"
    :title="title"
    :actionBtnLabel="actionBtnLabel"
    :customClassButton="{ red: true }"
    size="sm">
    {{
      $tc(
        "modal_delete_multiple_organizations.content",
        selectedOrganizations.length,
      )
    }}
  </ModalNew>
</template>
<script>
import { apiDeleteOrganisation } from "@/api/organisation.js"
import bulkRequest from "@/tools/bulkRequest.js"
import { bus } from "@/eventBus"

import ModalNew from "@/components/molecules/Modal.vue"

export default {
  props: {
    selectedOrganizations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: this.$tc(
        "modal_delete_multiple_organizations.title",
        this.selectedOrganizations.length,
      ),
      actionBtnLabel: this.$tc(
        "modal_delete_multiple_organizations.action_btn",
        this.selectedOrganizations.length,
      ),
    }
  },
  methods: {
    async deleteOrganizations() {
      const req = await bulkRequest(
        apiDeleteOrganisation,
        this.selectedOrganizations.map((_id) => [_id]),
        (count) => {
          bus.emit("app_notif", {
            status: "loading",
            message: this.$i18n.global.t(
              "modal_delete_multiple_organizations.loading_notification",
              { count, total: this.selectedOrganizations.length },
            ),
            timeout: -1,
            cantBeClosed: false,
          })
        },
      )

      if (req.status === "success") {
        this.$emit("on-confirm")
        bus.emit("app_notif", {
          status: "success",
          message: this.$i18n.global.t(
            "modal_delete_multiple_organizations.success_notification",
            { count: this.selectedOrganizations.length },
          ),
        })
      } else {
        bus.emit("app_notif", {
          status: "error",
          message: this.$tc(
            "modal_delete_multiple_organizations.error",
            this.selectedOrganizations.length,
          ),
        })
        this.$emit("on-close")
      }
    },
  },
  components: { ModalNew },
}
</script>
