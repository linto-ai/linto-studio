<template>
  <ModalNew
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="deleteOrganization"
    :title="$t('organisation.delete_modal.title')"
    :actionBtnLabel="$t('organisation.delete_modal.action')"
    :custom-class-button="{ red: true }"
    small>
    <p>
      {{
        $t("organisation.delete_modal.content", {
          name: currentOrganization.name,
        })
      }}
    </p>
  </ModalNew>
</template>
<script>
import { Fragment } from "vue-fragment"

import { bus } from "../main.js"
import { apiDeleteOrganisation } from "@/api/organisation.js"

import ModalNew from "./ModalNew.vue"
export default {
  props: {
    currentOrganization: {
      type: Object,
      required: true,
    },
    currentOrganizationScope: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    async deleteOrganization() {
      const res = await apiDeleteOrganisation(this.currentOrganizationScope)
      this.$emit("on-confirm", res)
    },
  },
  components: { Fragment, ModalNew },
}
</script>
