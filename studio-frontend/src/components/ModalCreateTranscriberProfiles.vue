<template>
  <ModalNew
    value
    @on-cancel="($event) => this.$emit('on-cancel')"
    @on-confirm="createTranscriberProfile"
    :actionBtnLabel="$t('modal_create_transcriber_profile.action_btn')"
    :title="$t('modal_create_transcriber_profile.title')">
    <div style="height: 100vh" class="flex col">
      <TranscriberProfileEditor
        class="flex1"
        @input="updateTranscriberProfile"
        :organizationId="organizationId"
        :transcriberProfile="transcriberProfile" />
    </div>
  </ModalNew>
</template>
<script>
import ModalNew from "@/components/molecules/Modal.vue"
import TranscriberProfileEditor from "@/components/TranscriberProfileEditor.vue"
import TRANSCRIBER_PROFILES_TEMPLATES from "@/const/transcriberProfilesTemplates"
import { apiAdminCreateTranscriberProfile } from "@/api/admin.js"
import { bus } from "@/main.js"

export default {
  props: {
    organizationId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      state: "idle",
      transcriberProfile: TRANSCRIBER_PROFILES_TEMPLATES.linto,
    }
  },
  mounted() {},
  methods: {
    updateTranscriberProfile(value) {
      this.transcriberProfile = structuredClone(value)
    },
    async createTranscriberProfile(event) {
      this.state = "loading"
      const res = await apiAdminCreateTranscriberProfile({
        ...this.transcriberProfile,
        organizationId: this.organizationId,
      })
      if (res.status === "success") {
        this.$emit("on-confirm", res)
      } else {
        bus.$emit("app_notif", {
          status: "error",
          message: this.$t("modal_create_transcriber_profile.notif_error"),
        })
      }
    },
  },
  components: { ModalNew, TranscriberProfileEditor },
}
</script>
