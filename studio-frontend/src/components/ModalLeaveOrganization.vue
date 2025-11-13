<template>
  <ModalNew
    v-model="_value"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="deleteOrganization"
    :title="$t('organisation.leave_modal.title')"
    :actionBtnLabel="$t('organisation.leave_modal.action')"
    :custom-class-button="{ red: true }"
    size="sm">
    <p>
      {{
        $t("organisation.leave_modal.content", {
          name: currentOrganization.name,
        })
      }}
    </p>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "@/main.js"
import { apiLeaveOrganisation } from "@/api/organisation.js"

import ModalNew from "@/components/molecules/Modal.vue"
export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async deleteOrganization() {
      const res = await apiLeaveOrganisation(this.currentOrganization._id)
      if (res.status == "success") {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("organisation.leave_modal.success_message"),
          type: "success",
        })
        this.$emit("on-confirm", res)
      } else {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("organisation.leave_modal.error_message"),
          type: "error",
        })
      }
    },
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit("input", val)
      },
    },
  },
  components: { Fragment, ModalNew },
}
</script>
