<template>
  <Modal
    v-model="_value"
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-delete="deleteUserFromOrganization"
    :title="$t('organisation.remove_user_modal.title')"
    :withActionApply="false"
    withActionDelete
    :textActionDelete="$t('organisation.remove_user_modal.action')"
    size="sm">
    <p>
      {{
        $t("organisation.remove_user_modal.content", {
          name: user ? user.email : "",
        })
      }}
    </p>
  </Modal>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "@/main.js"
import { apiRemoveUserFromOrganisation } from "@/api/user.js"

import Modal from "@/components/molecules/Modal.vue"
export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
    // null while the modal is closed: the caller only fills it on opening.
    user: {
      type: Object,
      default: null,
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
    async deleteUserFromOrganization() {
      //const res = await apiLeaveOrganisation(this.currentOrganization._id)

      const res = await apiRemoveUserFromOrganisation(
        this.currentOrganization._id,
        this.user._id,
      )

      this.$emit("on-confirm", res)
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
  components: { Fragment, Modal },
}
</script>
